// LoadingScreen.jsx
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [fade, setFade] = useState(false)
  const [phase, setPhase] = useState('scanning') 
  // phases: scanning → matched → done

  const phases = [
    { key: 'scanning', text: 'Scanning donor network...' },
    { key: 'matched',  text: 'Donors found nearby ✓'    },
  ]

  useEffect(() => {
    // Progress bar
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); return 100 }
        return p + 4
      })
    }, 40)

    // Phase change at 60%
    const phaseTimer = setTimeout(() => setPhase('matched'), 900)

    // Fade out
    const fadeTimer = setTimeout(() => setFade(true), 1400)

    // Done
    const doneTimer = setTimeout(() => onDone?.(), 1900)

    return () => {
      clearInterval(timer)
      clearTimeout(phaseTimer)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {!fade && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center
                     justify-center bg-gradient-to-br
                     from-blood-700 via-blood-600 to-blood-900"
        >
          {/* Background dots */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="flex flex-col items-center -mt-10 relative z-10">

            {/* Pulse rings + Logo */}
            <div className="relative flex items-center justify-center mb-10">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 border-white/30"
                  style={{ width: `${i * 80}px`, height: `${i * 80}px` }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* ✅ Heartbeat logo */}
              <motion.div
                className="relative w-24 h-24 rounded-full bg-white/15
                           backdrop-blur flex items-center justify-center
                           shadow-2xl border border-white/20"
                animate={{
                  scale: [1, 1.12, 1, 1.08, 1],
                }}
                transition={{
                  duration: 1.4,       // ~72 BPM
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src="/logo.png"
                  alt="BloodBridge AI"
                  className="w-16 h-16 object-contain"
                />
              </motion.div>
            </div>

            {/* Brand */}
            <motion.h1
              className="text-white font-display text-3xl font-black tracking-tight mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              BloodBridge <span className="text-gold">AI</span>
            </motion.h1>

            <motion.p
              className="text-red-200 text-sm mt-2 tracking-[0.25em] uppercase font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Connecting Donors · Saving Lives
            </motion.p>

            {/* Progress bar */}
            <div className="w-60 h-1.5 bg-white/20 rounded-full overflow-hidden mt-8">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Phase text with AnimatePresence swap */}
            <div className="mt-6 h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase}
                  className="text-white/60 text-xs tracking-wide text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {phases.find(p => p.key === phase)?.text}
                </motion.p>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}