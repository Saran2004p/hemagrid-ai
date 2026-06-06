import React from 'react'
import { useTranslation } from 'react-i18next'
import PatientForm from '../components/PatientForm'
import { AlertCircle, Zap, Clock, CheckCircle } from 'lucide-react'

export default function Patients() {
  const { t } = useTranslation()
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-dark to-gray-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <AlertCircle size={14} className="text-gold" />
            <span className="text-sm font-semibold">FOR PATIENTS & HOSPITALS</span>
          </div>
          <h1 className="font-display text-5xl font-black mb-4">{t('patient.title')}</h1>
          <p className="text-gray-300 text-xl max-w-xl mx-auto">{t('patient.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display text-3xl font-bold text-dark mb-8">What Happens After You Submit?</h2>
            <div className="space-y-4">
              {[
                { icon: Zap,          color:'text-blood-600',  title:'Instant AI Pulse',     desc:'Our AI immediately scans the entire donor network in your city.' },
                { icon: Clock,        color:'text-blue-600',   title:'Tiered Outreach',      desc:'Top-matched donors notified first. Network expands every 10 minutes until matched.' },
                { icon: CheckCircle,  color:'text-emerald-600',title:'Confirmation in Minutes',desc:'You receive confirmation with donor details via call or WhatsApp.' },
              ].map(step => {
                const Icon = step.icon
                return (
                  <div key={step.title} className="flex gap-4 glass-card p-5">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className={step.color} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-8 bg-blood-50 border border-blood-200 rounded-xl p-5">
              <p className="text-blood-800 text-sm font-semibold mb-1">🚨 Emergency?</p>
              <p className="text-blood-700 text-sm">Call us directly: <a href="tel:+916281477836" className="font-bold underline">+91 62814 77836</a> or WhatsApp for immediate assistance.</p>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="font-display text-2xl font-bold text-dark mb-6">Submit Blood Request</h2>
            <PatientForm />
          </div>
        </div>
      </div>
    </div>
  )
}
