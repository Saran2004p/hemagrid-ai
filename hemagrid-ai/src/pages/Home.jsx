import React from 'react'
import Hero from '../components/Hero'
import PulseMap from '../components/PulseMap'
import AIFinder from '../components/AIFinder'
import HowItWorks from '../components/HowItWorks'
import ImpactStats from '../components/ImpactStats'

export default function Home() {
  return (
    <>
      <Hero />
      <PulseMap />
      <AIFinder />
      <HowItWorks />
      <ImpactStats />
    </>
  )
}
