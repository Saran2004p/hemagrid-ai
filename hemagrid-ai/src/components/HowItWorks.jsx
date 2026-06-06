// HowItWorks.jsx (component)
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { AlertCircle, Cpu, Radio, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { icon: AlertCircle,  color: 'text-blood-600',   bg: 'bg-red-50',     border: 'border-blood-200',  key: 'step1' },
  { icon: Cpu,          color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200', key: 'step2' },
  { icon: Radio,        color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',   key: 'step3' },
  { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',key: 'step4' },
]

const AI_FACTORS = [
  { key: 'how.ai_factor1', pct: 95, color: '#c0392b' },
  { key: 'how.ai_factor2', pct: 80, color: '#3b82f6' },
  { key: 'how.ai_factor3', pct: 90, color: '#8b5cf6' },
  { key: 'how.ai_factor4', pct: 75, color: '#10b981' },
]

function ScoreCircle({ pct, color, label, inView, delay }) {
  const circumference = 2 * Math.PI * 34

  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-3">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#374151" strokeWidth="7" />
          <motion.circle
            cx="40" cy="40" r="34" fill="none"
            stroke={color} strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: inView
                ? circumference * (1 - pct / 100)
                : circumference,
            }}
            transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{pct}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-tight">{label}</p>
    </div>
  )
}

export default function HowItWorks() {
  const { t } = useTranslation()
  const stepsRef  = useRef(null)
  const aiRef     = useRef(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' })
  const aiInView    = useInView(aiRef,    { once: true, margin: '-60px' })

  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 bg-red-50
                          border border-red-200 rounded-full px-4 py-1.5 mb-4">
            <Radio size={14} className="text-blood-600" />
            <span className="text-blood-700 text-sm font-semibold">THE PULSE SYSTEM</span>
          </div>
          <h2 className="font-display text-4xl font-black text-dark mb-3">
            {t('how.title')}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t('how.subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%]
                          right-[12.5%] h-0.5 bg-gradient-to-r
                          from-blood-200 via-purple-200 to-emerald-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={stepsInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 40 }
                  }
                  transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`relative z-10 w-14 h-14 rounded-full ${step.bg}
                                border-2 ${step.border} flex items-center
                                justify-center mb-4`}
                  >
                    <Icon size={24} className={step.color} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full
                                    bg-dark text-white text-xs font-bold
                                    flex items-center justify-center">
                      {i + 1}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.2 }}
                    className={`glass-card p-6 w-full border ${step.border}`}
                  >
                    <h3 className="font-display text-lg font-bold text-dark mb-2">
                      {t(`how.${step.key}_title`)}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {t(`how.${step.key}_desc`)}
                    </p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ✅ AI Scoring — translated + animated circles */}
        <motion.div
          ref={aiRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-16 bg-gradient-to-br from-dark to-gray-800
                     rounded-2xl p-8 text-white"
        >
          <h3 className="font-display text-2xl font-bold text-center mb-2">
            {t('how.ai_title')}
          </h3>
          <p className="text-gray-400 text-center text-sm mb-8">
            {t('how.ai_subtitle')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AI_FACTORS.map((factor, i) => (
              <ScoreCircle
                key={factor.key}
                pct={factor.pct}
                color={factor.color}
                label={t(factor.key)}
                inView={aiInView}
                delay={i * 0.15 + 0.2}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}