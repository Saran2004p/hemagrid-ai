import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Droplets,
  Activity, ExternalLink
} from 'lucide-react'

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/donors',   icon: Users,           label: 'Donors'       },
  { to: '/requests', icon: Droplets,        label: 'Blood Requests'},
  { to: '/pulse',    icon: Activity,        label: 'Live Pulse'   },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col"
      style={{ background:'#13151f', borderRight:'1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 mb-1">
          {/*<div className="w-7 h-7 rounded-lg bg-blood-600 flex items-center justify-center">
            <Heart size={14} className="text-white" />
          </div>*/}
          <div className="w-14 h-14 flex items-center justify-center">
            <img
              src="/logo-tab-black-removebg.png"
              alt="BloodBridge AI"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-white text-sm">BloodBridge AI</span>
        </div>
        <div className="flex items-center gap-1.5 ml-9">
          <span className="live-dot" />
          <span className="text-xs text-green-400 font-medium">Coordinator Panel</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blood-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer links */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <a href="https://bloodbridge-ai.web.app" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <ExternalLink size={15} /> Public Website
        </a>
        <a href="https://console.firebase.google.com/project/bloodbridge-ai/firestore" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <ExternalLink size={15} /> Firestore DB
        </a>
      </div>
    </aside>
  )
}
