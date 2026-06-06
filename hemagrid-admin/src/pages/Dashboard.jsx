import React, { useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Heart, Users, Droplets, CheckCircle, AlertCircle, Activity } from 'lucide-react'
import StatCard from '../components/StatCard'
import Header   from '../components/Header'
import { useData } from '../hooks/useData'
import { fetchStats, fetchLivePulse } from '../api'

const BLOOD_COLORS = {
  'A+':'#ef4444','A-':'#f97316','B+':'#eab308','B-':'#22c55e',
  'AB+':'#06b6d4','AB-':'#8b5cf6','O+':'#ec4899','O-':'#c0392b',
}

const STATUS_COLORS = ['#60a5fa','#4ade80','#c084fc','#f59e0b']

export default function Dashboard() {
  const statsFn  = useCallback(fetchStats,    [])
  const pulseFn  = useCallback(fetchLivePulse,[])
  const { data: stats, loading: sLoad, lastUpdated, refresh } = useData(statsFn)
  const { data: pulse, loading: pLoad }                       = useData(pulseFn, 15000)

  const loading = sLoad || pLoad

  // Prepare chart data
  const statusData = stats ? [
    { name: 'Pending',   value: stats.requests?.pending   || 0, color: '#f59e0b' },
    { name: 'Pulse Sent',value: stats.requests?.pulseSent || 0, color: '#60a5fa' },
    { name: 'Matched',   value: stats.requests?.matched   || 0, color: '#4ade80' },
    { name: 'Fulfilled', value: stats.requests?.fulfilled || 0, color: '#c084fc' },
  ].filter(d => d.value > 0) : []

  const cityData = (pulse?.cityPulse || [])
    .sort((a,b) => b.requests - a.requests)
    .slice(0,8)
    .map(c => ({ name: c.city, requests: c.requests, urgent: c.hasUrgent ? 1 : 0 }))

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="BloodBridge AI — Coordinator Overview"
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={Droplets}    label="Total Requests"  value={stats?.requests?.total}    color="#c0392b" />
        <StatCard icon={AlertCircle} label="Pending"         value={stats?.requests?.pending}   color="#f59e0b" />
        <StatCard icon={Activity}    label="Pulse Sent"      value={stats?.requests?.pulseSent||0} color="#60a5fa" />
        <StatCard icon={CheckCircle} label="Matched"         value={stats?.requests?.matched}   color="#4ade80" />
        <StatCard icon={Heart}       label="Fulfilled"       value={stats?.requests?.fulfilled} color="#c084fc" />
        <StatCard icon={Users}       label="Active Donors"   value={stats?.donors?.available}
          sub={`of ${stats?.donors?.total || 0} total`} color="#06b6d4" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* City bar chart */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blood-600" />
            Active Requests by City
          </h3>
          {cityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cityData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background:'#1a1d2e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#e2e8f0' }}
                  cursor={{ fill:'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="requests" fill="#c0392b" radius={[6,6,0,0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              No active requests
            </div>
          )}
        </div>

        {/* Status pie chart */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Droplets size={16} className="text-blood-600" />
            Request Status Breakdown
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={3}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background:'#1a1d2e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#e2e8f0' }}
                />
                <Legend iconType="circle" iconSize={8}
                  formatter={(value) => <span style={{ color:'#94a3b8', fontSize:12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              No request data yet
            </div>
          )}
        </div>
      </div>

      {/* Live pulse summary */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="live-dot" />
          Live Network Status
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{pulse?.activePulses ?? '—'}</div>
            <div className="text-xs text-slate-500 mt-1">Active Pulses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{pulse?.matchedToday ?? '—'}</div>
            <div className="text-xs text-slate-500 mt-1">Fulfilled Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{pulse?.onlineDonors ?? '—'}</div>
            <div className="text-xs text-slate-500 mt-1">Online Donors</div>
          </div>
        </div>
      </div>
    </div>
  )
}
