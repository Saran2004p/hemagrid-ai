import React, { useState } from 'react'
import { Heart, Lock, Eye, EyeOff } from 'lucide-react'

// Simple password protection — change this password!
const ADMIN_PASSWORD = 'bloodbridge@2025'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [showPass,  setShowPass] = useState(false)
  const [error,     setError]   = useState('')
  const [loading,   setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('bb_admin_auth', 'true')
        onLogin()
      } else {
        setError('Incorrect password. Please try again.')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background:'linear-gradient(135deg, #0f1117 0%, #1a1d2e 100%)' }}>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage:'radial-gradient(circle, #c0392b 1px, transparent 1px)', backgroundSize:'32px 32px' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blood-600 flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">BloodBridge AI</h1>
          <p className="text-slate-400 text-sm mt-1">Coordinator Dashboard</p>
        </div>

        {/* Login card */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-blood-600" />
            <h2 className="text-white font-semibold">Secure Access</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter coordinator password"
                  className="w-full pr-10 text-sm"
                  autoFocus
                />
                <button type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !password}
              className="btn btn-primary w-full justify-center py-3 text-sm disabled:opacity-50">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...</>
              ) : 'Access Dashboard'}
            </button>
          </form>

          <p className="text-xs text-slate-600 text-center mt-4">
            Restricted to Blood Warriors coordinators only
          </p>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          BloodBridge AI — bloodbridge-ai.web.app
        </p>
      </div>
    </div>
  )
}
