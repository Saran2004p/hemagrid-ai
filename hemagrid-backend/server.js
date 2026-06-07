require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const rateLimit  = require('express-rate-limit')
const fallback   = require('./config/fallback')
const { verifyMailer }        = require('./email/mailer')
const { notifyAllDonors, notifyCoordinator, notifyDonorConfirmed, sendWelcomeEmail } = require('./email/sender')
const admin      = require('firebase-admin')
const { analyzeUrgency } = require('./aws/bedrock')
const { createRequest } = require("./services/requestService");
const http = require("http");
const { Server } = require("socket.io");
const {
  getCompatibleDonors,
} = require("./services/matchDonors");
const {
  rankDonors,
} = require("./services/rankDonors");
const {
  alertDonors,
} = require("./services/alertDonors");

const {
  coordinatorAgent,
} = require(
  "./agents/coordinatorAgent"
);
const {
  DynamoDBClient,
} = require(
  "@aws-sdk/client-dynamodb"
);
const {
  explainabilityAgent,
} = require(
  "./agents/explainabilityAgent"
);
const {
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  docClient,
} = require("./aws/dynamodb");

const {
  generateInsights,
} = require(
  "./services/analyticsService"
);

const {
  resourceAllocationAgent,
} = require(
  "./agents/resourceAllocationAgent"
);

const {
  forecastingAgent
} = require(
  "./agents/forecastingAgent"
);

const {
  getLearningData
} = require(
  "./services/getLearningData"
);

const {
  generateExplanation
} = require(
  "./services/explainabilityService"
);

const {
  getInventory
} = require(
  "./services/inventoryService"
);

const {
  predictiveShortageAgent,
} = require(
  "./agents/predictiveShortageAgent"
);

const {
  campaignRecommendationAgent,
} = require(
  "./agents/campaignRecommendationAgent"
);



// ── Initialize ────────────────────────────'──────

const db = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// verifyMailer()

const app = express()
app.use(helmet({ contentSecurityPolicy: false }))
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
  origin: function(origin, callback) {
    // Allow all Firebase web.app domains, localhost, and no-origin requests
    const allowed = [
      'https://bloodbridge-ai.web.app',
      'https://bloodbridge-admin-panel.web.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ]
    if (!origin || allowed.includes(origin) || origin.endsWith('.web.app')) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all for now — restrict in production
    }
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  credentials: true,
}))
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }))

const COMPATIBILITY = {
  'A+':['A+','A-','O+','O-'], 'A-':['A-','O-'],
  'B+':['B+','B-','O+','O-'], 'B-':['B-','O-'],
  'AB+':['A+','A-','B+','B-','AB+','AB-','O+','O-'], 'AB-':['A-','B-','AB-','O-'],
  'O+':['O+','O-'], 'O-':['O-'],
}

const scoreDonor = (donor, city, urgency) => {
  let s = 50
  if (donor.city?.toLowerCase() === city?.toLowerCase()) s += 30
  if (donor.isAvailable)  s += 10
  if (donor.responseRate >= 90) s += 10
  else if (donor.responseRate >= 70) s += 5
  if (urgency === 'critical' && donor.totalDonations >= 3) s += 5
  return Math.min(100, Math.max(0, s))
}

// ── Health Check ────────────────────────────────
app.get('/', (req, res) => res.json({
  success:   true,
  message: '🩸 HemaGrid AI Backend is running',
  version: 'HemaGrid v1.0',
  db:        global.DB_CONNECTED ? 'Firebase Firestore' : 'Offline/Demo mode',
  email:     global.EMAIL_CONNECTED ? 'Gmail ✅' : 'Not configured',
  timestamp: new Date().toISOString(),
}))

// ── POST /api/donors/register ───────────────────
app.post('/api/donors/register', async (req, res) => {
  const {
    name,
    age,
    phone,
    email,
    password,
    bloodType,
    city,
    preferredLanguage,
    fcmToken,
} = req.body

  if (!name || !phone || !bloodType || !city)
    return res.status(400).json({ success:false, message:'Missing required fields.' })

  if (!global.DB_CONNECTED) {
    const result = fallback.registerDonor(req.body)
    if (result.success && email) await sendWelcomeEmail({ donor:{ name, email, bloodType, city } })
    return res.status(201).json(result)
  }

  try {
    const db = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
    const existing = await db.collection('donors').where('phone','==',phone).limit(1).get()
    if (!existing.empty)
      return res.status(400).json({ success:false, message:'Phone number already registered.' })

    const ref = await db.collection('donors').add({
      name:name.trim(), 
      age:Number(age), 
      phone:phone.trim(),
      email:email?.trim()||'', 
      password: password || '',
      bloodType, 
      city:city.trim(),

      fcmToken: fcmToken || '',

      preferredLanguage:preferredLanguage||'English',
      consentGiven:true, 
      isAvailable:true, 
      isEligible:true,
      totalDonations:0, 
      responseRate:100, 
      lastDonationDate:null,
      createdAt:admin.firestore.FieldValue.serverTimestamp(),
    })

    if (email) await sendWelcomeEmail({ donor:{ name, email, bloodType, city } })

    res.status(201).json({
      success:true,
      message:`Thank you ${name}! You are now a BloodBridge donor.${email ? ' A welcome email has been sent!' : ''}`,
      data:{ id:ref.id, name, bloodType, city }
    })
  } catch (err) {
    res.status(500).json({ success:false, message:err.message })
  }
})

// ── GET /api/donors/stats ───────────────────────
app.get('/api/donors/stats', async (req, res) => {
  const { city, bloodType } = req.query
  if (!city || !bloodType)
    return res.status(400).json({ success:false, message:'city and bloodType required' })
  if (!global.DB_CONNECTED)
    return res.json({ success:true, data:fallback.getDonorStats(city, bloodType) })
  try {
    const db = getDB()
    const compatible = COMPATIBILITY[bloodType] || [bloodType]
    const snap = await db.collection('donors').where('isAvailable','==',true).where('isEligible','==',true).get()
    const donors = snap.docs.map(d=>d.data())
      .filter(d => compatible.includes(d.bloodType) && d.city?.toLowerCase()===city.toLowerCase())
    const stats = fallback.getDonorStats(city, bloodType)
    stats.availableDonors = donors.length
    stats.source = 'live'
    res.json({ success:true, data:stats })
  } catch (err) {
    res.json({ success:true, data:fallback.getDonorStats(city, bloodType) })
  }
})

// ── GET /api/donors/city-summary ────────────────
app.get('/api/donors/city-summary', async (req, res) => {
  if (!global.DB_CONNECTED)
    return res.json({ success:true, data:fallback.getCitySummary() })
  try {
    const db = getDB()
    const snap = await db.collection('donors').where('isAvailable','==',true).get()
    const s = {}
    snap.docs.forEach(doc => {
      const d = doc.data(); const k = d.city?.toLowerCase()
      if (!s[k]) s[k] = { _id:k, city:d.city, totalDonors:0, available:0 }
      s[k].totalDonors++
      if (d.isAvailable) s[k].available++
    })
    res.json({ success:true, data:Object.values(s) })
  } catch (err) {
    res.json({ success:true, data:fallback.getCitySummary() })
  }
})

// ── GET /api/donors ─────────────────────────────
app.get('/api/donors', async (req, res) => {
  if (!global.DB_CONNECTED) return res.json({ success:true, data:[] })
  try {
    const db = getDB()
    const snap = await db.collection('donors').orderBy('createdAt','desc').limit(50).get()
    res.json({ success:true, total:snap.size, data:snap.docs.map(d=>({id:d.id,...d.data()})) })
  } catch (err) {
    res.status(500).json({ success:false, message:err.message })
  }
})

// ── POST /api/requests ──────────────────────────
app.post('/api/requests', async (req, res) => {
  const { patientName, hospital, city, bloodType, unitsRequired, contactPerson, contactPhone, urgency } = req.body
  if (!patientName || !bloodType || !city || !contactPhone)
    return res.status(400).json({ success:false, message:'Missing required fields.' })

  if (!global.DB_CONNECTED) {
    const result = fallback.submitRequest(req.body)
    return res.status(201).json(result)
  }

  try {
    const db = getDB()
    const compatible = COMPATIBILITY[bloodType] || [bloodType]
    const donorSnap = await db.collection('donors')
      .where('isAvailable','==',true).where('isEligible','==',true).get()

    const matchedDonors = donorSnap.docs
      .map(d => ({ id:d.id, ...d.data() }))
      .filter(d => compatible.includes(d.bloodType) && d.city?.toLowerCase()===city.toLowerCase())
      .map(d => ({ ...d, aiScore:scoreDonor(d, city, urgency), status:'notified' }))
      .sort((a,b) => b.aiScore-a.aiScore)
      .slice(0, 10)

    const estimatedMinutes = matchedDonors.length > 0
      ? Math.max(5, Math.round(30-(matchedDonors[0]?.aiScore||50)*0.2)) : 60

    const requestData = {
      patientName:patientName.trim(), hospital:hospital?.trim()||'',
      city:city.trim(), bloodType, unitsRequired:Number(unitsRequired)||1,
      contactPerson:contactPerson?.trim()||'', contactPhone:contactPhone.trim(),
      urgency:urgency||'planned',

      /*matchedDonors:matchedDonors.slice(0,5).map(d=>({
        donorId:d.id, name:d.name, bloodType:d.bloodType,
        city:d.city, phone:d.phone, email:d.email, aiScore:d.aiScore, status:'notified'
      }))*/
      
      matchedDonors: matchedDonors.slice(0,5).map(d => ({
        donorId: d.id,
        name: d.name,
        bloodType: d.bloodType,
        city: d.city,

        phoneMasked: d.phone
          ? d.phone.slice(0,2) + 'XXXXXX' + d.phone.slice(-2)
          : '',

        phone: '',
        email: d.email || '',

        aiScore: d.aiScore,
        status: 'notified',

        contactShared: false
      })),
      status:matchedDonors.length>0?'pulse_sent':'pending',
      availableDonorCount:matchedDonors.length,
      estimatedMatchMinutes:estimatedMinutes,
      emailsSent:0,
      createdAt:admin.firestore.FieldValue.serverTimestamp(),
    }

    const docRef = await db.collection('bloodRequests').add(requestData)
    const requestId = docRef.id

    // ✅ Send emails to matched donors
    const donorsWithEmail = matchedDonors.filter(d => d.email)
    
    const sendPushNotification = require('./services/sendPushNotification')

    const donorTokens = matchedDonors
      .filter(d => d.fcmToken)
      .map(d => d.fcmToken)

    await sendPushNotification(donorTokens, requestData)

    const emailResult = await notifyAllDonors({ donors:donorsWithEmail, request:requestData, requestId })

    // ✅ Notify coordinator
    await notifyCoordinator({ request:requestData, requestId, matchedDonors:matchedDonors.slice(0,5) })

    await docRef.update({ emailsSent:emailResult.sent })

    res.status(201).json({
      success:true,
      message:matchedDonors.length>0
        ? `🩸 Pulse triggered! Found ${matchedDonors.length} donors. ${emailResult.sent} email(s) sent.`
        : `Request submitted. Coordinator notified. No donors in ${city} currently.`,
      data:{
        requestId, 
        status:requestData.status,
        compatibleDonorsFound:matchedDonors.length,
        emailsSent:emailResult.sent,
        estimatedMatchMinutes:estimatedMinutes,
        matchedDonors: requestData.matchedDonors
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success:false, message:err.message })
  }
})

// ── GET /api/respond (donor confirm/decline) ────
app.get('/api/respond', async (req, res) => {
  const { requestId, donorId, action } = req.query
  if (!requestId || !donorId || !action)
    return res.status(400).send('Invalid response link.')

  const confirmPage = (name, patient, hospital) => `
    <html><head><meta charset="UTF-8"/></head>
    <body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#f0fdf4;">
      <div style="max-width:460px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
        <div style="font-size:60px;">✅</div>
        <h1 style="color:#16a34a;">Thank You, ${name}!</h1>
        <p style="color:#555;font-size:16px;">You confirmed donation for <strong>${patient}</strong> at <strong>${hospital}</strong>.</p>
        <p style="color:#555;">Our coordinator will call you shortly!</p>
        <p style="color:#aaa;font-size:12px;margin-top:24px;">BloodBridge AI — bloodbridge-ai.web.app</p>
      </div>
    </body></html>`

  const declinePage = (name) => `
    <html><head><meta charset="UTF-8"/></head>
    <body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#fff5f5;">
      <div style="max-width:460px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
        <div style="font-size:60px;">🙏</div>
        <h1 style="color:#c0392b;">Response Recorded</h1>
        <p style="color:#555;font-size:16px;">Thank you, ${name}. We'll reach the next donor.</p>
        <p style="color:#aaa;font-size:12px;margin-top:24px;">BloodBridge AI — bloodbridge-ai.web.app</p>
      </div>
    </body></html>`

  if (!global.DB_CONNECTED) {
    return res.send(action === 'confirm' ? confirmPage('Donor','the patient','the hospital') : declinePage('Donor'))
  }

  try {
    const db = getDB()
    const [reqDoc, donorDoc] = await Promise.all([
      db.collection('bloodRequests').doc(requestId).get(),
      db.collection('donors').doc(donorId).get(),
    ])
    if (!reqDoc.exists) return res.status(404).send('Request not found.')

    const request = reqDoc.data()
    const donor   = { id:donorId, ...donorDoc.data() }

    if (action === 'confirm') {

      /*const updatedDonors = (request.matchedDonors||[]).map(d =>
        d.donorId === donorId ? { ...d, status:'confirmed', confirmedAt:new Date().toISOString() } : d
      )*/

      const updatedDonors = (request.matchedDonors || []).map(d =>
        d.donorId === donorId
          ? {
              ...d,
              status: 'confirmed',
              contactShared: true,
              confirmedAt: new Date().toISOString()
            }
          : d
      )

      await db.collection('bloodRequests').doc(requestId).update({
        matchedDonors:updatedDonors, status:'matched'
      })
      await notifyDonorConfirmed({ donor, request })
      return res.send(confirmPage(donor.name, request.patientName, request.hospital||request.city))
    } else {
      const updatedDonors = (request.matchedDonors||[]).map(d =>
        d.donorId === donorId ? { ...d, status:'declined' } : d
      )
      await db.collection('bloodRequests').doc(requestId).update({ matchedDonors:updatedDonors })
      return res.send(declinePage(donor.name))
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Something went wrong. Please try again.')
  }
})


// ── POST /api/contact ────────────────────────────
// ✅ BUG-09 FIX: Contact form messages now saved + emailed
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' })
  }
  try {
    // Save to Firestore if connected
    if (global.DB_CONNECTED) {
      const db = getDB()
      await db.collection('contactMessages').add({
        name, email, subject: subject || 'General',
        message, createdAt: require('firebase-admin').firestore.FieldValue.serverTimestamp(),
        status: 'unread'
      })
    }

    // Email coordinator
    if (global.EMAIL_CONNECTED) {
      const { transporter } = require('./email/mailer')
      const FROM = `"BloodBridge AI 🩸" <${process.env.EMAIL_USER}>`
      const COORDINATOR = process.env.COORDINATOR_EMAIL || 'contact.bloodbridge@gmail.com'
      await transporter.sendMail({
        from: FROM,
        to:   COORDINATOR,
        replyTo: email,
        subject: `💬 Contact Form: ${subject || 'Message'} — from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
            <div style="background:#1c1c1c;padding:20px;border-radius:12px 12px 0 0;">
              <h2 style="color:white;margin:0;font-size:18px;">📩 New Contact Message</h2>
            </div>
            <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#888;font-size:13px;width:100px;">From</td><td style="color:#1c1c1c;font-weight:600;">${name}</td></tr>
                <tr><td style="padding:6px 0;color:#888;font-size:13px;">Email</td><td style="color:#3b82f6;">${email}</td></tr>
                <tr><td style="padding:6px 0;color:#888;font-size:13px;">Subject</td><td style="color:#1c1c1c;">${subject || 'General'}</td></tr>
              </table>
              <div style="background:#f9fafb;border-radius:8px;padding:14px;margin-top:14px;">
                <p style="color:#555;font-size:14px;line-height:1.6;margin:0;">${message}</p>
              </div>
              <p style="color:#aaa;font-size:12px;margin-top:14px;">Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        `,
        text: `Contact from ${name} (${email}): ${message}`
      })
    }

    res.json({ success: true, message: 'Message received! We will get back to you within 24 hours.' })
  } catch (err) {
    console.error('Contact form error:', err.message)
    // Still return success — don't block user
    res.json({ success: true, message: 'Message received!' })
  }
})

// ── GET /api/requests/live-pulse ────────────────
app.get('/api/requests/live-pulse', async (req, res) => {
  if (!global.DB_CONNECTED)
    return res.json({ success:true, data:fallback.getLivePulse() })
  try {
    const db = getDB()
    const [reqSnap, donorSnap, fulfilledSnap] = await Promise.all([
      db.collection('bloodRequests').where('status','in',['pending','pulse_sent','matched']).get(),
      db.collection('donors').where('isAvailable','==',true).get(),
      db.collection('bloodRequests').where('status','==','fulfilled').get(),
    ])
    const cityPulse = {}
    reqSnap.docs.forEach(doc => {
      const r = doc.data(); const k = r.city?.toLowerCase()
      if (!cityPulse[k]) cityPulse[k] = { city:r.city, requests:0, hasUrgent:false }
      cityPulse[k].requests++
      if (r.urgency==='critical') cityPulse[k].hasUrgent = true
    })
    res.json({ success:true, data:{
      activePulses:reqSnap.size, matchedToday:fulfilledSnap.size,
      onlineDonors:donorSnap.size, cityPulse:Object.values(cityPulse), source:'live'
    }})
  } catch (err) {
    res.json({ success:true, data:fallback.getLivePulse() })
  }
})

// ── GET /api/requests/stats ─────────────────────
app.get('/api/requests/stats', async (req, res) => {
  if (!global.DB_CONNECTED)
    return res.json({ success:true, data:{ requests:{total:0}, donors:{total:0,available:0} } })
  try {
    const db = getDB()
    const [reqs, donors] = await Promise.all([db.collection('bloodRequests').get(), db.collection('donors').get()])
    const r = reqs.docs.map(d=>d.data())
    res.json({ success:true, data:{
      requests:{ total:r.length, pending:r.filter(x=>x.status==='pending').length,
        matched:r.filter(x=>x.status==='matched').length, fulfilled:r.filter(x=>x.status==='fulfilled').length },
      donors:{ total:donors.size, available:donors.docs.filter(d=>d.data().isAvailable).length }
    }})
  } catch (err) {
    res.status(500).json({ success:false, message:err.message })
  }
})

// ── GET /api/requests ───────────────────────────
app.get('/api/requests', async (req, res) => {
  if (!global.DB_CONNECTED) return res.json({ success:true, data:[] })
  try {
    const db = getDB()
    const snap = await db.collection('bloodRequests').orderBy('createdAt','desc').limit(50).get()
    res.json({ success:true, total:snap.size, data:snap.docs.map(d=>({id:d.id,...d.data()})) })
  } catch (err) {
    res.status(500).json({ success:false, message:err.message })
  }
})

// ── Start Server ────────────────────────────────

app.post(
  "/api/agent-workflow",
  async (req, res) => {
    try {
      const result =
        await coordinatorAgent(req.body);

      res.json({
        success: true,
        result,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

app.post(
  "/api/explain",
  async (req, res) => {

    try {

      const donor =
        req.body;

      const result =
        await explainabilityAgent(
          donor
        );

      res.json({
        success: true,
        result,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        error:
          error.message,
      });

    }
  }
);

app.get(
  "/api/dashboard",
  async (req, res) => {

    const learning =
      await docClient.send(
        new ScanCommand({
          TableName:
            "hemagrid-learning",
        })
      );

    const donors =
      await docClient.send(
        new ScanCommand({
          TableName:
            "hemagrid-donors",
        })
      );

    const requests =
      learning.Items || [];

    const donorList =
      donors.Items || [];

    const criticalCases =
      requests.filter(
        r =>
          r.urgency ===
          "CRITICAL"
      ).length;

    const matchesToday =
      requests.filter(
        r =>
          r.donorCount > 0
      ).length;

    res.json({
      totalRequests:
        requests.length,

      criticalCases,

      availableDonors:
        donorList.filter(
          d => d.available
        ).length,

      matchesToday,
    });
  }
);

app.get(
  "/api/events",
  async (req, res) => {

    try {

      const result =
        await docClient.send(
          new ScanCommand({
            TableName:
              "hemagrid-events",
          })
        );

      const events =
        (result.Items || [])
          .sort(
            (a, b) =>
              new Date(
                b.timestamp
              ) -
              new Date(
                a.timestamp
              )
          )
          .slice(0, 20);

      res.json(events);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          "Failed to fetch events"
      });
    }
  }
);

app.get(
  "/api/insights",
  async (req, res) => {

    const insights =
      await generateInsights();

    res.json(insights);
  }
);

app.get(
  "/api/forecast",
  async (req,res)=>{

    try {

      const history =
        await getLearningData();

      const result =
        await forecastingAgent(
          history
        );

      res.json(result);

    } catch(err){

      console.error(err);

      res.status(500).json({
        error:
          err.message
      });
    }
  }
);

app.get(
  "/api/donor-memory",
  async (req, res) => {

    try {

      const result =
        await docClient.send(
          new ScanCommand({
            TableName:
              "hemagrid-donors"
          })
        );

      const donors =
        result.Items || [];

      const processed =
        donors.map(d => ({

          donorId:
            d.donorId,

          name:
            d.name,

          totalRequests:
            d.totalRequests || 0,

          responses:
            d.responses || 0,

          responseRate:
            d.totalRequests
              ? Math.round(
                  (
                    d.responses /
                    d.totalRequests
                  ) * 100
                )
              : 0,
        }));

      processed.sort(
        (a, b) =>
          b.responseRate -
          a.responseRate
      );

      res.json(processed);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Failed to load donor memory"
      });
    }
  }
);

app.post(
  "/api/resource-allocation",

  async (
    req,
    res
  ) => {

    const result =
      await resourceAllocationAgent(
        req.body
      );

    res.json(
      result
    );
  }
);

app.get(
  "/api/explainability/:donorId",

  async (
    req,
    res
  ) => {

    const donors =
      await getDonorMemory();

    const donor =
      donors.find(
        d =>
          d.donorId ===
          req.params.donorId
      );

    if (!donor) {

      return res
        .status(404)
        .json({
          error:
            "Donor not found"
        });
    }

    res.json(
      generateExplanation(
        donor
      )
    );
  }
);

app.get(
  "/api/inventory",
  async (req,res) => {

    const inventory =
      await getInventory();

    res.json(inventory);
  }
);

app.get(
  "/api/shortages",

  async (
    req,
    res
  ) => {

    const result =
      await predictiveShortageAgent();

    res.json(
      result
    );
  }
);

app.get(
  "/api/campaigns",

  async (
    req,
    res
  ) => {

    const result =
      await campaignRecommendationAgent();

    res.json(
      result
    );
  }
);

const PORT = process.env.PORT || 5000;

const server =
  http.createServer(app);

const io =
  new Server(server, {
    cors: {
      origin: "*"
    }
  });

global.io = io;

io.on(
  "connection",
  socket => {

    console.log(
      "Client Connected"
    );

    socket.on(
      "disconnect",
      () =>
        console.log(
          "Client Disconnected"
        )
    );
  }
);

server.listen(
  PORT,
  () =>
    console.log(
      `Running on ${PORT}`
    )
);