// App.jsx
import React, { Suspense, lazy, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ScrollToTop from './components/ScrollToTop'
import Explainability from "./pages/Explainability";
import ProtectedRoute from "./components/ProtectedRoute";

const Home       = lazy(() => import('./pages/Home'))
const Donors     = lazy(() => import('./pages/Donors'))
const Patients   = lazy(() => import('./pages/Patients'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const About      = lazy(() => import('./pages/About'))
const Contact    = lazy(() => import('./pages/Contact'))
const NotFound   = lazy(() => import('./pages/NotFound'))
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'))
const DonorLogin = lazy(() => import('./pages/DonorLogin'))
const DonorAuth = lazy(() => import('./pages/DonorAuth'))
const AIAgents = lazy(() => import('./pages/AIAgents'))
const CoordinationCenter = lazy(() => import('./pages/CoordinationCenter'))
const DonorMemory = lazy(() => import("./pages/DonorMemory"));
const Forecast = lazy(() => import("./pages/Forecast"));

function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-red-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blood-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-blood-600 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// ✅ Separated so useLocation works inside BrowserRouter context
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
        transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
        onAnimationStart={() => {
          window.scrollTo(0, 0);
        }}
      >
        <Suspense fallback={<PageSpinner />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/donor-auth" element={<DonorAuth />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/donor-login" element={<DonorLogin />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/explainability" element={<Explainability />} />
            <Route path="/ai-agents" element={<AIAgents />} />
            <Route path="/coordination" element={<CoordinationCenter />} />
            <Route path="/donor-memory" element={<DonorMemory />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/coordination-center" element={
              <ProtectedRoute>
                <CoordinationCenter/>
              </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </motion.div>
    </>
  )
}