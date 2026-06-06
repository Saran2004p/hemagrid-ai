// AIFinder.jsx
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Droplets, MapPin, Zap,
  CheckCircle, AlertTriangle, Clock,
} from 'lucide-react'
import { getDonorStats } from '../api'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const color  = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#c0392b'

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none"
                stroke="#f1f5f9" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-display text-3xl font-black"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, type: 'spring' }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-gray-400 font-medium">/ 100</span>
      </div>
    </div>
  )
}

export default function AIFinder() {
  const { t }       = useTranslation()
  const [bloodType, setBloodType] = useState('')
  const [city,      setCity]      = useState('')
  const [result,    setResult]    = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [step,      setStep]      = useState(1)

  const handleCheck = async () => {
    if (!bloodType || !city.trim()) return
    setLoading(true)
    try {
      const res = await getDonorStats(city, bloodType)
      if (res.success) {
        setResult({
          score:     res.data.availabilityScore,
          donors:    res.data.availableDonors,
          time:      res.data.estimatedMatchMinutes,
          level:     res.data.availability,
          bloodType, city,
          source: 'live',
        })
        setStep(3)
      }
    } catch {
      const fallback = Math.floor(Math.random() * 40) + 50
      setResult({
        score:     fallback,
        donors:    Math.floor(Math.random() * 80) + 20,
        time:      Math.floor(Math.random() * 20) + 8,
        bloodType, city,
        source: 'demo',
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const getAvailLabel = (score) => {
    if (score >= 75) return t('finder.result_high')
    if (score >= 50) return t('finder.result_medium')
    return t('finder.result_low')
  }
  const getAvailIcon = (score) => {
    if (score >= 75) return <CheckCircle  size={18} className="text-emerald-600" />
    if (score >= 50) return <Clock        size={18} className="text-amber-600"   />
    return                  <AlertTriangle size={18} className="text-blood-600"  />
  }

  return (
    <motion.section
      className="section-pad bg-gradient-to-br from-blood-600
                 via-blood-700 to-blood-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20
                          rounded-full px-4 py-1.5 mb-4">
            <Zap size={14} className="text-gold" />
            <span className="text-white text-sm font-semibold">
              AI MATCHING ENGINE — LIVE DATA
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-3">
            {t('finder.title')}
          </h2>
          <p className="text-red-100 text-lg max-w-xl mx-auto">
            {t('finder.subtitle')}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="glass-card p-8 md:p-10 max-w-2xl mx-auto bg-white"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 transition-all ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                  <motion.div
                    animate={{
                      backgroundColor: step > s
                        ? '#10b981'
                        : step === s
                          ? '#c0392b'
                          : '#e5e7eb',
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full flex items-center
                               justify-center text-sm font-bold text-white"
                  >
                    {step > s ? '✓' : s}
                  </motion.div>
                  <span className="text-xs font-semibold text-gray-600 hidden sm:block">
                    {t(`finder.step${s}`)}
                  </span>
                </div>
                {s < 3 && (
                  <motion.div
                    className="flex-1 h-0.5 max-w-[60px]"
                    animate={{ backgroundColor: step > s ? '#10b981' : '#e5e7eb' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Blood type selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Droplets size={14} className="inline mr-1 text-blood-600" />
                    {t('finder.step1')}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_TYPES.map((type) => (
                      <motion.button
                        key={type}
                        onClick={() => { setBloodType(type); setStep(s => Math.max(s, 2)) }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        animate={{
                          backgroundColor: bloodType === type ? '#c0392b' : '#ffffff',
                          borderColor:     bloodType === type ? '#c0392b' : '#e5e7eb',
                          color:           bloodType === type ? '#ffffff' : '#374151',
                          scale:           bloodType === type ? 1.05     : 1,
                        }}
                        transition={{ duration: 0.15 }}
                        className="py-2.5 rounded-xl text-sm font-bold border-2 shadow-sm"
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* City input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="inline mr-1 text-blood-600" />
                    {t('finder.step2')}
                  </label>
                  <motion.input
                    type="text"
                    className="form-input"
                    placeholder={t('finder.city_placeholder')}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                    whileFocus={{
                      boxShadow: '0 0 0 4px rgba(192,57,43,0.12)',
                      borderColor: '#c0392b',
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  onClick={handleCheck}
                  disabled={!bloodType || !city.trim() || loading}
                  whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className="btn-primary w-full flex items-center justify-center
                             gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Scanning live donor database...
                    </>
                  ) : (
                    <><Search size={18} />{t('finder.check')}</>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-6"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    {t('finder.result_title')}
                  </p>
                  <ScoreRing score={result.score} />
                </div>

                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {getAvailIcon(result.score)}
                  <span className="font-bold text-lg text-dark">
                    {getAvailLabel(result.score)}
                  </span>
                </motion.div>

                <motion.div
                  className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="font-bold text-blood-600 text-lg">
                    {result.donors}
                  </span>{' '}
                  {t('finder.result_desc')}{' '}
                  <span className="font-bold text-dark">
                    {result.time} {t('finder.minutes')}
                  </span>
                  <div className="mt-1 text-xs text-gray-400">
                    Blood type: <strong>{result.bloodType}</strong> · City: <strong>{result.city}</strong>
                  </div>
                  <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${
                    result.source === 'demo' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {result.source === 'demo'
                      ? '⚡ Demo data — register donors to see live counts'
                      : '✅ Live data from BloodBridge donor database'
                    }
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setResult(null)
                      setBloodType('')
                      setCity('')
                      setStep(1)
                    }}
                    className="btn-secondary flex-1 text-sm py-2.5"
                  >
                    Check Again
                  </motion.button>
                  <a href="/patients" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-primary w-full text-sm py-2.5"
                    >
                      Request Blood
                    </motion.button>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  )
}