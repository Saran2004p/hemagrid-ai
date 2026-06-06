const COMPATIBILITY = {
  'A+':  ['A+','A-','O+','O-'],
  'A-':  ['A-','O-'],
  'B+':  ['B+','B-','O+','O-'],
  'B-':  ['B-','O-'],
  'AB+': ['A+','A-','B+','B-','AB+','AB-','O+','O-'],
  'AB-': ['A-','B-','AB-','O-'],
  'O+':  ['O+','O-'],
  'O-':  ['O-'],
}

const CITY_BASE = {
  'delhi':94,'mumbai':88,'hyderabad':92,'chennai':85,
  'bengaluru':90,'kolkata':78,'pune':72,'ahmedabad':68,
  'jaipur':61,'lucknow':58,'kochi':65,'chandigarh':70,
}

const BLOOD_MODIFIER = {
  'O-':-15,'AB-':-12,'B-':-10,'A-':-8,
  'O+':5,'AB+':8,'A+':3,'B+':2,
}

let memoryDonors = [
  { id:'1', name:'Arjun Sharma',  bloodType:'O+',  city:'Hyderabad', isAvailable:true,  totalDonations:5,  responseRate:95  },
  { id:'2', name:'Priya Nair',    bloodType:'A+',  city:'Chennai',   isAvailable:true,  totalDonations:3,  responseRate:90  },
  { id:'3', name:'Rahul Verma',   bloodType:'B+',  city:'Mumbai',    isAvailable:true,  totalDonations:7,  responseRate:98  },
  { id:'4', name:'Vikram Singh',  bloodType:'O-',  city:'Delhi',     isAvailable:true,  totalDonations:10, responseRate:100 },
  { id:'5', name:'Ananya Das',    bloodType:'A-',  city:'Kolkata',   isAvailable:true,  totalDonations:1,  responseRate:80  },
  { id:'6', name:'Karthik Menon', bloodType:'B-',  city:'Bengaluru', isAvailable:true,  totalDonations:4,  responseRate:92  },
  { id:'7', name:'Deepa Iyer',    bloodType:'O+',  city:'Chennai',   isAvailable:true,  totalDonations:6,  responseRate:97  },
  { id:'8', name:'Suresh Patel',  bloodType:'AB-', city:'Ahmedabad', isAvailable:true,  totalDonations:8,  responseRate:94  },
  { id:'9', name:'Meera Pillai',  bloodType:'A+',  city:'Kochi',     isAvailable:false, totalDonations:3,  responseRate:88  },
  { id:'10',name:'Naveen Raj',    bloodType:'AB+', city:'Bengaluru', isAvailable:true,  totalDonations:15, responseRate:100 },
  { id:'11',name:'Sonia Kapoor',  bloodType:'B+',  city:'Delhi',     isAvailable:true,  totalDonations:12, responseRate:100 },
  { id:'12',name:'Ravi Kumar',    bloodType:'O-',  city:'Hyderabad', isAvailable:true,  totalDonations:9,  responseRate:96  },
  { id:'13',name:'Amit Joshi',    bloodType:'O+',  city:'Pune',      isAvailable:true,  totalDonations:0,  responseRate:100 },
  { id:'14',name:'Sneha Reddy',   bloodType:'AB+', city:'Hyderabad', isAvailable:true,  totalDonations:2,  responseRate:85  },
  { id:'15',name:'Pooja Bhatt',   bloodType:'A+',  city:'Mumbai',    isAvailable:false, totalDonations:1,  responseRate:75  },
]
let memoryRequests = []
let nextId = 100

const getDonorStats = (city, bloodType) => {
  const cityKey  = (city||'').toLowerCase().trim()
  const base     = CITY_BASE[cityKey] || 55
  const modifier = BLOOD_MODIFIER[bloodType] || 0
  const score    = Math.max(10, Math.min(99, base + modifier))
  const compatible = COMPATIBILITY[bloodType] || [bloodType]
  const count = memoryDonors.filter(d =>
    d.isAvailable && compatible.includes(d.bloodType) &&
    (!city || d.city.toLowerCase() === cityKey)
  ).length
  return {
    city, bloodType,
    availableDonors: count,
    availabilityScore: score,
    estimatedMatchMinutes: Math.max(5, Math.round((100-score)*0.8)),
    availability: score>=75?'high':score>=50?'medium':'low',
    source: 'demo',
  }
}

const registerDonor = (data) => {
  if (memoryDonors.find(d => d.phone === data.phone))
    return { success:false, message:'Phone already registered.' }
  const donor = { id: String(nextId++), ...data, isAvailable:true, totalDonations:0, responseRate:100 }
  memoryDonors.push(donor)
  return { success:true, message:`Thank you ${data.name}! Registered successfully.`, data: { id:donor.id } }
}

const submitRequest = (data) => {
  const compatible = COMPATIBILITY[data.bloodType] || [data.bloodType]
  const matched = memoryDonors.filter(d =>
    d.isAvailable && compatible.includes(d.bloodType) &&
    d.city.toLowerCase() === (data.city||'').toLowerCase()
  )
  const req = { id: String(nextId++), ...data, status:'pulse_sent', matchedCount:matched.length }
  memoryRequests.push(req)
  return {
    success: true,
    message: matched.length > 0
      ? `🩸 Pulse triggered! Found ${matched.length} donors in ${data.city}.`
      : `Request submitted. Expanding search to nearby cities.`,
    data: { requestId:req.id, status:'pulse_sent', compatibleDonorsFound:matched.length, estimatedMatchMinutes:matched.length>0?10:45 }
  }
}

const getCitySummary = () => {
  const s = {}
  memoryDonors.forEach(d => {
    const k = d.city.toLowerCase()
    if (!s[k]) s[k] = { _id:k, city:d.city, totalDonors:0, available:0 }
    s[k].totalDonors++
    if (d.isAvailable) s[k].available++
  })
  return Object.values(s)
}

const getLivePulse = () => ({
  activePulses: memoryRequests.filter(r=>r.status==='pulse_sent').length || 3,
  matchedToday: 12,
  onlineDonors: memoryDonors.filter(d=>d.isAvailable).length,
  cityPulse: [
    { city:'Hyderabad', requests:2, hasUrgent:true  },
    { city:'Mumbai',    requests:1, hasUrgent:false },
    { city:'Delhi',     requests:1, hasUrgent:true  },
    { city:'Chennai',   requests:1, hasUrgent:false },
  ],
  source: 'demo',
})

module.exports = { getDonorStats, registerDonor, submitRequest, getCitySummary, getLivePulse }
