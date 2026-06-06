import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Target, Eye, Calendar } from 'lucide-react'
import ImpactStats from '../components/ImpactStats'


export default function About() {
  const { t } = useTranslation()
  const location = useLocation()

  // ✅ FIX 2: Auto-scroll to thalassemia section if hash present
  useEffect(() => {
    if (location.hash === '#thalassemia') {
      setTimeout(() => {
        const el = document.getElementById('thalassemia')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [location])

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blood-700 to-blood-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl font-black mb-4">{t('about.title')}</h1>
          <p className="text-red-100 text-xl max-w-2xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-display text-3xl font-bold text-dark mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{t('about.body')}</p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Eye,      title: 'Our Vision',  desc: t('about.vision'),  color: 'text-blood-600', bg: 'bg-red-50'     },
                { icon: Target,   title: 'Our Mission', desc: t('about.mission'), color: 'text-blue-600',  bg: 'bg-blue-50'    },
                { icon: Calendar, title: 'Founded',     desc: 'Established in 2020 in Hyderabad with a mission to make India Thalassemia-free by 2035.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="glass-card p-5 flex gap-4">
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className={item.color} />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark mb-1 text-sm">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ✅ FIX 2: Added id="thalassemia" for scroll target */}
          <div id="thalassemia" className="bg-gradient-to-br from-dark to-gray-800 rounded-2xl p-8 text-white scroll-mt-24">
            <h3 className="font-display text-2xl font-bold mb-4 text-center">What is Thalassemia?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
              <div>
                <p className="font-semibold text-white mb-2">🧬 The Condition</p>
                <p>Thalassemia is an inherited blood disorder where the body produces abnormal hemoglobin, leading to destruction of red blood cells and severe anaemia.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">🩸 The Treatment</p>
                <p>Patients require regular blood transfusions every 15–20 days — for their entire lifetime. There is no cure without a bone marrow transplant, only lifelong management.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">🛡️ Prevention</p>
                <p>Genetic testing before marriage can prevent Thalassemia. If both parents are carriers, there's a 25% chance each child will have the disease. Early screening saves lives.</p>
              </div>
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
              {[
                { stat: '1M+',    label: 'Patients in India'        },
                { stat: '10,000', label: 'New cases every year'     },
                { stat: '4%',     label: 'Indians are gene carriers'},
              ].map(item => (
                <div key={item.stat} className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-black text-blood-400">{item.stat}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ImpactStats />
    </div>
  )
}
