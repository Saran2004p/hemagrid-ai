// ImpactStats.jsx
import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Heart, Users, Shield, TrendingUp, MapPin, Target } from 'lucide-react'

const STATS = [
  { key: 'i1', icon: Heart,      color: 'text-blood-600',   bg: 'bg-red-50'      },
  { key: 'i2', icon: Users,      color: 'text-blue-600',    bg: 'bg-blue-50'     },
  { key: 'i3', icon: Shield,     color: 'text-purple-600',  bg: 'bg-purple-50'   },
  { key: 'i4', icon: TrendingUp, color: 'text-amber-600',   bg: 'bg-amber-50'    },
  { key: 'i5', icon: MapPin,     color: 'text-emerald-600', bg: 'bg-emerald-50'  },
  { key: 'i6', icon: Target,     color: 'text-rose-600',    bg: 'bg-rose-50'     },
]

export default function ImpactStats() {
  const { t }  = useTranslation()
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-pad bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 bg-red-50
                          border border-red-200 rounded-full px-4 py-1.5 mb-4">
            <TrendingUp size={14} className="text-blood-600" />
            <span className="text-blood-700 text-sm font-semibold">REAL IMPACT</span>
          </div>
          <h2 className="font-display text-4xl font-black text-dark mb-3">
            {t('impact.title')}
          </h2>
          <p className="text-gray-500 text-lg">{t('impact.subtitle')}</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={inView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 40, scale: 0.95 }
                }
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 16px 40px rgba(192,57,43,0.12)',
                  transition: { duration: 0.2 },
                }}
                className="glass-card p-6 text-center cursor-default"
              >
                <motion.div
                  animate={inView
                    ? { scale: [1, 1.2, 1], rotate: [0, 5, 0] }
                    : {}
                  }
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                  className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center
                              justify-center mx-auto mb-4`}
                >
                  <Icon size={22} className={stat.color} />
                </motion.div>
                <div className={`font-display text-3xl font-black ${stat.color} mb-1`}>
                  {t(`impact.${stat.key}`)}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {t(`impact.${stat.key}l`)}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
          className="mt-12 bg-gradient-to-r from-blood-600 to-blood-800
                     rounded-2xl p-8 text-white flex flex-col md:flex-row
                     items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-display text-2xl font-bold mb-1">
              4% of India carries the Thalassemia gene
            </h3>
            <p className="text-red-100 text-sm">
              That's 56 million+ carriers in a nation of 1.4 billion.
              Early detection & regular transfusions are the only lifeline.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/about#thalassemia">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-blood-700 font-bold px-6 py-3
                           rounded-full hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                {t('about.learn')}
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}