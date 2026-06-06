import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { Activity, Users, CheckCircle } from 'lucide-react'
import { getLivePulse } from '../api'

const INDIA_CITIES = [
  { name:'Hyderabad',    lat:17.385, lng:78.487, donors:142, active:true  },
  { name:'Mumbai',       lat:19.076, lng:72.878, donors:198, active:true  },
  { name:'Delhi',        lat:28.704, lng:77.102, donors:231, active:true  },
  { name:'Chennai',      lat:13.083, lng:80.270, donors:117, active:true  },
  { name:'Kolkata',      lat:22.573, lng:88.364, donors:89,  active:true  },
  { name:'Bengaluru',    lat:12.972, lng:77.594, donors:156, active:true  },
  { name:'Pune',         lat:18.520, lng:73.856, donors:74,  active:false },
  { name:'Ahmedabad',    lat:23.023, lng:72.572, donors:63,  active:false },
  { name:'Jaipur',       lat:26.912, lng:75.787, donors:48,  active:true  },
  { name:'Lucknow',      lat:26.847, lng:80.947, donors:55,  active:false },
  { name:'Bhopal',       lat:23.259, lng:77.413, donors:39,  active:false },
  { name:'Patna',        lat:25.594, lng:85.138, donors:31,  active:true  },
  { name:'Bhubaneswar',  lat:20.296, lng:85.825, donors:27,  active:false },
  { name:'Chandigarh',   lat:30.734, lng:76.779, donors:44,  active:true  },
  { name:'Kochi',        lat:9.931,  lng:76.267, donors:52,  active:false },
  { name:'Coimbatore',   lat:11.017, lng:76.956, donors:38,  active:true  },
  { name:'Visakhapatnam',lat:17.686, lng:83.218, donors:41,  active:false },
  { name:'Indore',       lat:22.719, lng:75.857, donors:35,  active:true  },
]

// ✅ BUG-05 FIX: Cache key for localStorage
const CACHE_KEY = 'bb_pulse_cache'

function LiveCounter({ value, label, icon: Icon, color }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const target = Number(value) || 0
    if (target === 0) { setCount(0); return }
    const step  = Math.ceil(target / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 40)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="flex flex-col items-center text-center p-4">
      <Icon size={20} className={color} />
      <div className={`font-display text-2xl font-black mt-1 ${color}`}>{count}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

export default function PulseMap() {
  const { t } = useTranslation()
  const [tick, setTick]       = useState(0)
  const [liveData, setLiveData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // ✅ BUG-05 FIX: Load cached data first so counters never show blank
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        setLiveData(parsed)
      }
    } catch {}
  }, [])

  // Fetch live data and update cache
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLivePulse()
        if (res.success && res.data) {
          setLiveData(res.data)
          setLastUpdated(new Date())
          // ✅ BUG-05: Save to localStorage cache
          localStorage.setItem(CACHE_KEY, JSON.stringify(res.data))
        }
      } catch {}
    }
    fetchData()
    const timer = setInterval(fetchData, 30000)
    return () => clearInterval(timer)
  }, [])

  // Animate pulse rings
  useEffect(() => {
    const t = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(t)
  }, [])

  const activePulses  = liveData?.activePulses  ?? INDIA_CITIES.filter(c=>c.active).length
  const matchedToday  = liveData?.matchedToday  ?? 12
  const onlineDonors  = liveData?.onlineDonors  ?? INDIA_CITIES.reduce((s,c)=>s+c.donors,0)

  // Merge live city data with static positions
  const cityPulseMap  = {}
  ;(liveData?.cityPulse || []).forEach(c => { cityPulseMap[c.city?.toLowerCase()] = c })

  return (
    <section className="section-pad bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-blood-600 animate-ping-slow" />
            <span className="text-blood-700 text-sm font-semibold">LIVE NETWORK</span>
          </div>
          <h2 className="font-display text-4xl font-black text-dark mb-3">{t('pulse.title')}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t('pulse.subtitle')}</p>
          {/* ✅ BUG-05: Show last updated time */}
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-2">
              Live data · Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Live counters */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
          <div className="glass-card">
            <LiveCounter value={activePulses} label={t('pulse.active')}  icon={Activity}     color="text-blood-600"   />
          </div>
          <div className="glass-card">
            <LiveCounter value={matchedToday} label={t('pulse.matched')} icon={CheckCircle}  color="text-emerald-600" />
          </div>
          <div className="glass-card">
            <LiveCounter value={onlineDonors} label={t('pulse.donors')}  icon={Users}        color="text-blue-600"    />
          </div>
        </div>

        {/* Map — ✅ BUG-07 FIX: scrollWheelZoom disabled, touch friendly */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100" style={{ height:'480px' }}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height:'100%', width:'100%' }}
            zoomControl={true}
            scrollWheelZoom={false}
            dragging={true}
            touchZoom={true}
            doubleClickZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {INDIA_CITIES.map(city => {
              const liveCity = cityPulseMap[city.name.toLowerCase()]
              const isActive = liveCity ? liveCity.requests > 0 : city.active
              const isUrgent = liveCity?.hasUrgent || false

              return (
                <React.Fragment key={city.name}>
                  {isActive && (
                    <CircleMarker
                      center={[city.lat, city.lng]}
                      radius={14 + (tick % 3) * 2}
                      pathOptions={{ color: isUrgent ? '#c0392b' : '#3b82f6', fillColor: isUrgent ? '#c0392b' : '#3b82f6', fillOpacity:0.08, weight:1.5, opacity:0.4 }}
                    />
                  )}
                  <CircleMarker
                    center={[city.lat, city.lng]}
                    radius={isActive ? 8 : 5}
                    pathOptions={{
                      color:       isActive ? (isUrgent ? '#c0392b' : '#3b82f6') : '#94a3b8',
                      fillColor:   isActive ? (isUrgent ? '#e74c3c' : '#60a5fa') : '#cbd5e1',
                      fillOpacity: 0.9, weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="text-center p-1 min-w-[130px]">
                        <div className="font-bold text-dark text-sm">{city.name}</div>
                        <div className="text-blood-600 font-semibold text-xs mt-1">
                          {liveCity ? `${liveCity.requests} active request${liveCity.requests>1?'s':''}` : `${city.donors} donors online`}
                        </div>
                        <div className={`text-xs mt-1 font-medium ${isActive ? (isUrgent ? 'text-red-500' : 'text-blue-500') : 'text-gray-400'}`}>
                          {isActive ? (isUrgent ? '🔴 Urgent Pulse' : '🔵 Active Pulse') : '⚪ Standby'}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              )
            })}
          </MapContainer>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          🔴 Urgent pulse &nbsp;|&nbsp; 🔵 Active pulse &nbsp;|&nbsp; ⚪ Standby — no active request
        </p>
      </div>
    </section>
  )
}
