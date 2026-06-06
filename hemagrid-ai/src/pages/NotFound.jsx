import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blood-600 via-blood-700 to-blood-900 flex items-center justify-center px-4 pt-16">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="relative text-center text-white max-w-lg mx-auto">
        {/* Animated blood drop */}
        <div className="relative flex items-center justify-center mb-8">
          {[1, 2].map(i => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white/20"
              style={{ width: `${i * 100}px`, height: `${i * 100}px`, animation: `pulseRing 2.5s ease-out ${i * 0.7}s infinite` }}
            />
          ))}
          <div className="w-24 h-24 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
            <AlertCircle size={40} className="text-white" />
          </div>
        </div>

        {/* 404 text */}
        <div className="font-display text-9xl font-black text-white/20 leading-none mb-2">404</div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          This page needs a donor!
        </h1>
        <p className="text-red-200 text-lg mb-8 leading-relaxed">
          The page you're looking for doesn't exist. But there are Thalassemia patients who need your help — let's get you back on track.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button className="flex items-center gap-2 bg-white text-blood-700 font-bold px-6 py-3 rounded-full hover:bg-red-50 transition-all hover:-translate-y-0.5 shadow-lg">
              <Home size={18} />
              Back to Home
            </button>
          </Link>
          <Link to="/donors">
            <button className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/30 text-white font-bold px-6 py-3 rounded-full hover:bg-white/25 transition-all hover:-translate-y-0.5">
              <Heart size={18} />
              Become a Donor
            </button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { to: '/patients',    label: 'Request Blood'  },
            { to: '/how-it-works',label: 'How It Works'   },
            { to: '/about',       label: 'About Us'       },
            { to: '/contact',     label: 'Contact'        },
          ].map(link => (
            <Link key={link.to} to={link.to} className="text-red-200 hover:text-white text-sm underline underline-offset-2 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
