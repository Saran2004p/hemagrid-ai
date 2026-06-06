// Footer.jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Phone, Mail, MapPin, MessageCircle, ChevronDown } from 'lucide-react'

// ✅ Mobile accordion section
function FooterAccordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-800 md:border-none">
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 md:hidden
                   text-left text-sm font-semibold text-white uppercase tracking-wider"
      >
        {title}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      {/* Desktop — always visible */}
      <div className="hidden md:block">
        <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
          {title}
        </h4>
        {children}
      </div>

      {/* Mobile — accordion */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Footer() {
  const { t }    = useTranslation()
  const location = useLocation()

  const navLinks = [
    { to: '/',             label: t('nav.home')     },
    { to: '/donors',       label: t('nav.donors')   },
    { to: '/patients',     label: t('nav.patients') },
    { to: '/how-it-works', label: t('nav.how')      },
    { to: '/about',        label: t('nav.about')    },
    { to: '/contact',      label: t('nav.contact')  },
  ]

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-10">

          {/* Brand — always visible */}
          <div className="md:col-span-2 pb-6 md:pb-0 border-b border-gray-800 md:border-none mb-2 md:mb-0">
            <motion.img
              src="/logo.png"
              alt="BloodBridge AI"
              className="h-14 mb-4 object-contain"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 text-gold text-sm font-semibold">
              <motion.div
                animate={{ scale: [1, 1.2, 1, 1.1, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Heart size={14} />
              </motion.div>
              {t('footer.thalassemia')}
            </div>
          </div>

          {/* Quick links — accordion on mobile */}
          <FooterAccordion title={t('footer.quick_links')}>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={(e) => {
                      if (location.pathname === link.to) {
                        e.preventDefault()
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                    className="text-gray-400 hover:text-blood-400 text-sm
                               transition-colors hover:translate-x-1 inline-block
                               transition-transform duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Contact — accordion on mobile */}
          <FooterAccordion title={t('footer.contact_us')}>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-blood-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+916281477836" className="hover:text-white transition-colors">
                  {t('contact.phone')}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-blood-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@bloodwarriors.in"
                  className="hover:text-white transition-colors break-all"
                >
                  {t('contact.email')}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-blood-400 mt-0.5 flex-shrink-0" />
                <span>{t('contact.location')}</span>
              </li>
              <li>
                <motion.a
                  href="https://wa.me/916281477836"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-emerald-600
                             hover:bg-emerald-500 text-white text-xs font-bold
                             px-4 py-2 rounded-full transition-colors mt-1"
                >
                  <MessageCircle size={13} /> WhatsApp Us
                </motion.a>
              </li>
            </ul>
          </FooterAccordion>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col
                        sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">{t('footer.rights')}</p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Built with{' '}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <Heart size={10} className="text-blood-500" />
            </motion.span>
            {' '}for India's Thalassemia Warriors
          </p>
        </div>
      </div>
    </footer>
  )
}