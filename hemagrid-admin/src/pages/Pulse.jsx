import React, { useCallback } from 'react'
import { Activity, Zap, Users, CheckCircle, AlertTriangle } from 'lucide-react'
import Header from '../components/Header'
import { useData } from '../hooks/useData'
import { fetchLivePulse } from '../api'

export default function Pulse() {
  const pulseFn = useCallback(fetchLivePulse, [])
  const { data, loading, lastUpdated, refresh } = useData(pulseFn, 10000)

  const cityPulse = data?.cityPulse || []

  return (
    <div>
      <Header
        title="Live Pulse"
        subtitle="Real-time blood request network — auto-refreshes every 10 seconds"
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Live counters */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center mx-auto mb-3">
            <Zap size={22} className="text-blue-400" />
          </div>
          <div className="text-4xl font-black text-blue-400 mb-1">{data?.activePulses ?? '—'}</div>
          <div className="text-slate-400 text-sm">Active Pulses</div>
          <div className="text-slate-600 text-xs mt-1">Requests awaiting donors</div>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={22} className="text-green-400" />
          </div>
          <div className="text-4xl font-black text-green-400 mb-1">{data?.matchedToday ?? '—'}</div>
          <div className="text-slate-400 text-sm">Fulfilled Today</div>
          <div className="text-slate-600 text-xs mt-1">Successful donations</div>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center mx-auto mb-3">
            <Users size={22} className="text-purple-400" />
          </div>
          <div className="text-4xl font-black text-purple-400 mb-1">{data?.onlineDonors ?? '—'}</div>
          <div className="text-slate-400 text-sm">Online Donors</div>
          <div className="text-slate-600 text-xs mt-1">Available right now</div>
        </div>
      </div>

      {/* City pulse grid */}
      <div className="card mb-6">
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
          <Activity size={16} className="text-blood-600" />
          Active Pulses by City
        </h3>
        {cityPulse.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No active pulses right now — network is on standby 🟢
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cityPulse
              .sort((a,b) => b.requests - a.requests)
              .map((city, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: city.hasUrgent ? 'rgba(192,57,43,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${city.hasUrgent ? 'rgba(192,57,43,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${city.hasUrgent ? 'bg-red-500' : 'bg-blue-500'}`} />
                    {city.hasUrgent && (
                      <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{city.city}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {city.requests} active request{city.requests > 1 ? 's' : ''}
                    </div>
                  </div>
                  {city.hasUrgent && (
                    <div className="flex items-center gap-1 text-xs text-red-400 font-bold">
                      <AlertTriangle size={11} /> Urgent
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Data source note */}
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span className="live-dot" />
        Live data from Firebase Firestore — refreshes automatically every 10 seconds
        {data?.source === 'fallback' && (
          <span className="text-amber-500 ml-2">⚠️ Demo data (backend offline)</span>
        )}
      </div>
    </div>
  )
}
