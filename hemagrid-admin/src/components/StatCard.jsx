import React from 'react'

export default function StatCard({ icon: Icon, label, value, sub, color = '#c0392b', trend }) {
  return (
    <div className="card flex items-start gap-4 hover:border-white/10 transition-colors">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}22` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={`text-xs font-bold px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}
        </div>
      )}
    </div>
  )
}
