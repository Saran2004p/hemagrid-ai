import React from 'react'
import { RefreshCw } from 'lucide-react'

export default function Header({ title, subtitle, lastUpdated, onRefresh, loading }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
        {lastUpdated && (
          <p className="text-slate-600 text-xs mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
      <button onClick={onRefresh} disabled={loading}
        className="btn btn-ghost flex items-center gap-2">
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        Refresh
      </button>
    </div>
  )
}
