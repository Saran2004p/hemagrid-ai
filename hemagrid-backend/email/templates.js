const BASE_URL = process.env.BACKEND_URL || 'https://bloodbridge-backend-3d5m.onrender.com'
const SITE_URL = process.env.CLIENT_URL  || 'https://bloodbridge-ai.web.app'

// ✅ BUG-04 FIX: Proper email headers to avoid Promotions tab
const getHeaders = (to) => ({
  'Precedence': 'bulk',
  'X-Mailer': 'BloodBridge-AI-Mailer',
  'List-Unsubscribe': `<mailto:contact@bloodwarriors.in?subject=Unsubscribe>`,
})

const donorNotificationEmail = ({ donor, request, requestId, aiScore }) => {
  const confirmUrl = `${BASE_URL}/api/respond?requestId=${requestId}&donorId=${donor.id}&action=confirm`
  const declineUrl = `${BASE_URL}/api/respond?requestId=${requestId}&donorId=${donor.id}&action=decline`
  const urgencyColor = request.urgency === 'critical' ? '#c0392b' : '#e67e22'
  const urgencyLabel = request.urgency === 'critical' ? '🚨 CRITICAL' : '📅 PLANNED'

  return {
    subject: `Action Required: ${request.bloodType} blood needed in ${request.city}`,
    headers: getHeaders(donor.email),
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:28px 20px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:26px;font-weight:900;">🩸 BloodBridge AI</h1>
    <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Connecting Donors. Saving Lives.</p>
  </div>
  <div style="max-width:560px;margin:20px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="background:${urgencyColor};padding:10px 24px;text-align:center;">
      <span style="color:white;font-weight:700;font-size:14px;letter-spacing:1px;">${urgencyLabel} — YOUR RESPONSE NEEDED</span>
    </div>
    <div style="padding:28px;">
      <h2 style="color:#1c1c1c;margin:0 0 10px;font-size:20px;">Dear ${donor.name},</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">A Thalassemia patient urgently needs your help. You are one of our top matched donors.</p>
      <div style="background:#fff5f5;border:1.5px solid #fecaca;border-radius:12px;padding:18px;margin-bottom:22px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#888;font-size:13px;width:140px;">Blood Type Needed</td><td style="color:#c0392b;font-weight:700;font-size:16px;">${request.bloodType}</td></tr>
          <tr><td style="padding:5px 0;color:#888;font-size:13px;">Your Blood Type</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${donor.bloodType} ✅ Compatible</td></tr>
          <tr><td style="padding:5px 0;color:#888;font-size:13px;">Hospital</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${request.hospital || 'Shared on confirm'}</td></tr>
          <tr><td style="padding:5px 0;color:#888;font-size:13px;">City</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${request.city}</td></tr>
          <tr><td style="padding:5px 0;color:#888;font-size:13px;">Units Required</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${request.unitsRequired || 1} unit(s)</td></tr>
          <tr><td style="padding:5px 0;color:#888;font-size:13px;">Match Score</td><td style="color:#16a34a;font-weight:700;font-size:13px;">${aiScore}/100 ⭐</td></tr>
        </table>
      </div>
      <p style="color:#444;font-size:14px;margin:0 0 14px;font-weight:600;">Can you donate? Please respond:</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding-right:8px;"><a href="${confirmUrl}" style="display:block;background:linear-gradient(135deg,#c0392b,#e74c3c);color:white;text-decoration:none;padding:13px 20px;border-radius:50px;font-weight:700;font-size:14px;text-align:center;">✅ Yes, I Can Donate</a></td>
          <td style="padding-left:8px;"><a href="${declineUrl}" style="display:block;background:white;color:#888;text-decoration:none;padding:13px 20px;border-radius:50px;font-weight:600;font-size:14px;border:2px solid #e5e7eb;text-align:center;">❌ Can't Donate Now</a></td>
        </tr>
      </table>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:13px 16px;">
        <p style="color:#15803d;font-size:13px;margin:0;line-height:1.6;">💚 <strong>Your response saves a life.</strong> Once you confirm, our coordinator will contact you with full details.</p>
      </div>
    </div>
    <div style="background:#f9fafb;padding:16px 24px;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="color:#aaa;font-size:11px;margin:0 0 4px;">You received this because you registered as a donor on BloodBridge AI.</p>
      <p style="color:#aaa;font-size:11px;margin:0;"><a href="${SITE_URL}" style="color:#c0392b;text-decoration:none;">bloodbridge-ai.web.app</a> | <a href="mailto:contact@bloodwarriors.in" style="color:#c0392b;text-decoration:none;">contact@bloodwarriors.in</a></p>
    </div>
  </div>
</body></html>`,
    text: `Dear ${donor.name},\n\nA patient needs ${request.bloodType} blood in ${request.city}.\n\nConfirm: ${confirmUrl}\nDecline: ${declineUrl}\n\nBloodBridge AI`
  }
}

const coordinatorNotificationEmail = ({ request, requestId, matchedDonors }) => {
  const rows = matchedDonors.map((d,i) => `<tr style="background:${i%2===0?'#fff':'#f9fafb'}"><td style="padding:9px 12px;font-size:12px;font-weight:600;">${d.name||'Donor '+(i+1)}</td><td style="padding:9px 12px;font-size:12px;color:#c0392b;font-weight:700;">${d.bloodType}</td><td style="padding:9px 12px;font-size:12px;">${d.city}</td><td style="padding:9px 12px;font-size:12px;color:#16a34a;font-weight:700;">${d.aiScore}/100</td><td style="padding:9px 12px;font-size:12px;color:#3b82f6;">${d.phone||'On file'}</td></tr>`).join('')
  return {
    subject: `🚨 New Blood Request — ${request.bloodType} needed in ${request.city}`,
    headers: getHeaders('coordinator'),
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="background:linear-gradient(135deg,#1c1c1c,#374151);padding:22px 20px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:20px;font-weight:900;">🩸 BloodBridge AI — Coordinator Alert</h1>
  </div>
  <div style="max-width:620px;margin:20px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="background:#c0392b;padding:10px 24px;"><span style="color:white;font-weight:700;font-size:14px;">🚨 NEW REQUEST — ACTION REQUIRED</span></div>
    <div style="padding:24px;">
      <div style="background:#fff5f5;border:1.5px solid #fecaca;border-radius:12px;padding:16px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:4px 0;color:#888;font-size:12px;width:150px;">Patient</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${request.patientName}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:12px;">Blood Type</td><td style="color:#c0392b;font-weight:700;font-size:15px;">${request.bloodType}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:12px;">Hospital</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${request.hospital||'Not specified'}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:12px;">City</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${request.city}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:12px;">Units</td><td style="color:#1c1c1c;font-weight:600;font-size:13px;">${request.unitsRequired||1}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:12px;">Urgency</td><td style="color:#c0392b;font-weight:700;font-size:13px;">${(request.urgency||'').toUpperCase()}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:12px;">Contact</td><td style="color:#3b82f6;font-weight:700;font-size:13px;">${request.contactPhone}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:12px;">Donors Notified</td><td style="color:#16a34a;font-weight:700;font-size:13px;">${matchedDonors.length} donors emailed</td></tr>
        </table>
      </div>
      <h3 style="color:#1c1c1c;margin:0 0 10px;font-size:14px;">Top Matched Donors (AI Ranked)</h3>
      <div style="border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="background:#1c1c1c;"><th style="padding:9px 12px;color:white;font-size:11px;text-align:left;">Name</th><th style="padding:9px 12px;color:white;font-size:11px;text-align:left;">Blood</th><th style="padding:9px 12px;color:white;font-size:11px;text-align:left;">City</th><th style="padding:9px 12px;color:white;font-size:11px;text-align:left;">Score</th><th style="padding:9px 12px;color:white;font-size:11px;text-align:left;">Phone</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
    <div style="background:#f9fafb;padding:14px 24px;text-align:center;border-top:1px solid #f0f0f0;">
      <p style="color:#aaa;font-size:11px;margin:0;">BloodBridge AI — bloodbridge-ai.web.app</p>
    </div>
  </div>
</body></html>`,
    text: `NEW BLOOD REQUEST\nPatient: ${request.patientName}\nBlood: ${request.bloodType}\nCity: ${request.city}\nPhone: ${request.contactPhone}\n${matchedDonors.length} donors notified.`
  }
}

const donorConfirmedEmail = ({ donor, request }) => ({
  subject: `✅ Donor Confirmed — ${donor.name} will donate ${request.bloodType} in ${request.city}`,
  headers: getHeaders('coordinator'),
  html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="background:linear-gradient(135deg,#15803d,#16a34a);padding:22px;text-align:center;"><h1 style="color:white;margin:0;font-size:20px;">✅ Donor Confirmed!</h1></div>
  <div style="max-width:500px;margin:20px auto;background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <h2 style="color:#15803d;margin:0 0 14px;">Great news! A donor has confirmed.</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;color:#888;font-size:13px;width:130px;">Donor Name</td><td style="color:#1c1c1c;font-weight:700;">${donor.name}</td></tr>
      <tr><td style="padding:5px 0;color:#888;font-size:13px;">Blood Type</td><td style="color:#c0392b;font-weight:700;">${donor.bloodType}</td></tr>
      <tr><td style="padding:5px 0;color:#888;font-size:13px;">Phone</td><td style="color:#3b82f6;font-weight:700;">${donor.phone}</td></tr>
      <tr><td style="padding:5px 0;color:#888;font-size:13px;">For Patient</td><td style="color:#1c1c1c;font-weight:600;">${request.patientName}</td></tr>
      <tr><td style="padding:5px 0;color:#888;font-size:13px;">Hospital</td><td style="color:#1c1c1c;font-weight:600;">${request.hospital||request.city}</td></tr>
    </table>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;margin-top:18px;">
      <p style="color:#15803d;margin:0;font-size:13px;">📞 Please call the donor to confirm timing and coordinate with the hospital.</p>
    </div>
  </div>
</body></html>`,
  text: `Donor ${donor.name} (${donor.bloodType}) confirmed. Phone: ${donor.phone}. For patient: ${request.patientName}`
})

const donorWelcomeEmail = ({ donor }) => ({
  subject: `Welcome to BloodBridge AI, ${donor.name}! You're now a lifeline 🩸`,
  headers: getHeaders(donor.email),
  html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:28px 20px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:26px;font-weight:900;">🩸 BloodBridge AI</h1>
    <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Connecting Donors. Saving Lives.</p>
  </div>
  <div style="max-width:520px;margin:20px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="padding:28px;">
      <h2 style="color:#1c1c1c;margin:0 0 10px;">Welcome, ${donor.name}! 🎉</h2>
      <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 18px;">You are now officially a <strong>BloodBridge AI donor</strong>. Thank you for joining our mission to make India Thalassemia-free by 2035.</p>
      <div style="background:#fff5f5;border:1.5px solid #fecaca;border-radius:12px;padding:16px;margin-bottom:18px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:4px 0;color:#888;font-size:13px;width:120px;">Your Name</td><td style="color:#1c1c1c;font-weight:600;">${donor.name}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:13px;">Blood Type</td><td style="color:#c0392b;font-weight:700;font-size:15px;">${donor.bloodType}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:13px;">City</td><td style="color:#1c1c1c;font-weight:600;">${donor.city}</td></tr>
          <tr><td style="padding:4px 0;color:#888;font-size:13px;">Status</td><td style="color:#16a34a;font-weight:700;">✅ Active Donor</td></tr>
        </table>
      </div>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:13px 16px;">
        <p style="color:#15803d;font-size:13px;margin:0;line-height:1.6;">💚 <strong>What happens next?</strong> When a Thalassemia patient near ${donor.city} needs ${donor.bloodType} blood, you'll receive an email alert. Just click YES to confirm!</p>
      </div>
    </div>
    <div style="background:#f9fafb;padding:14px 24px;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="color:#aaa;font-size:11px;margin:0;"><a href="${SITE_URL}" style="color:#c0392b;text-decoration:none;">bloodbridge-ai.web.app</a> | <a href="mailto:contact@bloodwarriors.in" style="color:#c0392b;text-decoration:none;">contact@bloodwarriors.in</a></p>
    </div>
  </div>
</body></html>`,
  text: `Welcome ${donor.name}! You are now a BloodBridge AI donor. Blood type: ${donor.bloodType}. City: ${donor.city}. We'll contact you when a patient needs help!`
})

module.exports = { donorNotificationEmail, coordinatorNotificationEmail, donorConfirmedEmail, donorWelcomeEmail }
