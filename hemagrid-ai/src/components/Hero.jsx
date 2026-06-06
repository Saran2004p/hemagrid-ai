// Hero.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Heart, AlertCircle, Users,
  Activity, TrendingUp, MessageCircle,
} from 'lucide-react'

const STATS = [
  { key: 'stat1', value: '1M+',  icon: Heart,      color: 'text-blood-600'  },
  { key: 'stat2', value: '579+', icon: Users,      color: 'text-blue-600'   },
  { key: 'stat3', value: '20',   icon: Activity,   color: 'text-emerald-600', sub: true },
  { key: 'stat4', value: '10K+', icon: TrendingUp, color: 'text-amber-600'  },
]

// Stagger variants for children
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const statVariants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1 + 0.8, duration: 0.4, ease: 'backOut' },
  }),
}


function PulseOrb() {
  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
      {/* Pulse rings — Framer Motion */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-blood-400"
          animate={{ scale: [0.7, 2.5], opacity: [0.6, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Main orb */}
      <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full
                      bg-gradient-to-br from-blood-500 via-blood-600 to-blood-800
                      shadow-2xl flex items-center justify-center">
        <div className="absolute inset-3 rounded-full bg-white/10 backdrop-blur-sm" />

        {/* ✅ Heartbeat logo */}
        <motion.div
          className="relative z-10 text-center"
          animate={{ scale: [1, 1.08, 1, 1.05, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/logo.png"
            alt="BloodBridge AI"
            className="w-36 md:w-44 mx-auto drop-shadow-lg"
          />
        </motion.div>

        {/* Floating dots */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad    = (angle * Math.PI) / 180
          const radius = 47
          const cx     = 50 + radius * Math.sin(rad)
          const cy     = 50 - radius * Math.cos(rad)
          return (
            <motion.div
              key={i}
              className="absolute w-3.5 h-3.5 rounded-full bg-gold
                         border-2 border-white shadow-lg"
              style={{
                left: `${cx}%`,
                top:  `${cy}%`,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function Hero() {
  const { t } = useTranslation()

  // ✅ Parallax — orb moves slower than text on scroll
  const { scrollY } = useScroll()
  const orbY  = useTransform(scrollY, [0, 400], [0, -60])
  const textY = useTransform(scrollY, [0, 400], [0, -30])

  return (
    <section className="relative min-h-screen flex items-center pt-16
                        overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c0392b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Background blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blood-100
                      rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50
                      rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ✅ Left — staggered entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: textY }}
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 bg-blood-50
                              border border-blood-200 rounded-full px-4 py-1.5 mb-6">
                <motion.div
                  className="w-2 h-2 rounded-full bg-blood-600"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="text-blood-700 text-sm font-semibold tracking-wide">
                  {t('hero.tagline')}
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl lg:text-7xl
                         font-black text-dark leading-tight mb-6"
            >
              {t('hero.title')
                .split(' ')
                .map((word, i) => (
                  <span key={i} className={i === 0 ? 'gradient-text' : ''}>
                    {word}{' '}
                  </span>
                ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link to="/donors">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary flex items-center gap-2 text-base"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    <Heart size={18} />
                  </motion.span>
                  {t('hero.cta_donor')}
                </motion.button>
              </Link>

              <Link to="/patients">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary flex items-center gap-2 text-base"
                >
                  <AlertCircle size={18} />
                  {t('hero.cta_patient')}
                </motion.button>
              </Link>

              <a
                href="https://wa.me/916281477836"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-emerald-500
                             hover:bg-emerald-600 text-white font-semibold
                             px-5 py-3 rounded-full transition-colors text-base"
                >
                  <MessageCircle size={18} /> Emergency? WhatsApp
                </motion.button>
              </a>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(({ key, value, icon: Icon, color, sub }, i) => (
                <motion.div
                  key={key}
                  custom={i}
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="glass-card p-4 text-center cursor-default"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <Icon size={20} className={`${color} mx-auto mb-1`} />
                  </motion.div>
                  <div className={`font-display text-2xl font-black ${color}`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                    {t(`hero.${key}`)}
                    {sub && (
                      <div className="text-gray-400">{t('hero.stat3_sub')}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ✅ Right orb — parallax */}
          <motion.div
            className="flex justify-center lg:justify-end"
            style={{ y: orbY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: 'backOut' }}
          >
            <PulseOrb />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-0.5 h-8 bg-gradient-to-b from-blood-400 to-transparent rounded-full" />
        <div className="w-2 h-2 rounded-full bg-blood-400" />
      </motion.div>
    </section>
  )
}