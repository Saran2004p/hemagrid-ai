import React from 'react'
import HowItWorksComponent from '../components/HowItWorks'
import AIFinder from '../components/AIFinder'

export default function HowItWorksPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-gray-900 to-dark text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-5xl font-black mb-4">The Pulse System</h1>
          <p className="text-gray-300 text-xl">How AI orchestrates blood donation across India — intelligently, instantly, at scale.</p>
        </div>
      </section>
      <HowItWorksComponent />
      <AIFinder />
    </div>
  )
}
