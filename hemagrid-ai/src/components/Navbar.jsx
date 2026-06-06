// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "हि", name: "Hindi" },
  { code: "ta", label: "த", name: "Tamil" },
  { code: "te", label: "తె", name: "Telugu" },
  { code: "bn", label: "বা", name: "Bengali" },
  { code: "mr", label: "म", name: "Marathi" },
  { code: "gu", label: "ગ", name: "Gujarati" },
  { code: "kn", label: "ಕ", name: "Kannada" },
  { code: "ml", label: "മ", name: "Malayalam" },
  { code: "pa", label: "ਪ", name: "Punjabi" },
  { code: "or", label: "ଓ", name: "Odia" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navRef = useRef(null);
  const langRef = useRef(null);
  const mobileLangRef = useRef(null);
  const [donor, setDonor] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [location]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        langRef.current &&
        !langRef.current.contains(e.target) &&
        mobileLangRef.current &&
        !mobileLangRef.current.contains(e.target)
      ) {
        setLangOpen(false);
      }

      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutside);

    return () => {
      document.removeEventListener("click", handleOutside);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const updateDonor = () => {
      const storedDonor = localStorage.getItem("bloodbridge_donor");

      if (storedDonor) {
        setDonor(JSON.parse(storedDonor));
      } else {
        setDonor(null);
      }
    };

    updateDonor();

    window.addEventListener("storage", updateDonor);

    return () => {
      window.removeEventListener("storage", updateDonor);
    };
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/donors", label: t("nav.donors") },
    { to: "/patients", label: t("nav.patients") },
    { to: "/how-it-works", label: t("nav.how") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <motion.nav
      ref={navRef}
      // ✅ FIXED: correct blur logic — blurred + solid AFTER scroll
      className="fixed top-0 left-0 right-0 z-50"
      animate={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.82)"
          : "rgba(255,255,255,0.58)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        boxShadow: scrolled
          ? "0 1px 20px rgba(0,0,0,0.08)"
          : "0 0px 0px rgba(0,0,0,0)",
        height: scrolled ? "60px" : "68px",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo — shrinks on scroll */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <motion.img
              src="/logo.png"
              alt="BloodBridge AI"
              className="object-contain"
              animate={{ height: scrolled ? "36px" : "44px" }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => {
                  if (location.pathname === link.to) {
                    e.preventDefault();
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                    setMenuOpen(false);
                  }
                }}
                className={`nav-link text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-blood-600"
                    : "text-gray-700 hover:text-blood-600"
                }`}
              >
                {link.label}

                {isActive(link.to) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blood-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right: lang + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm font-medium
                           text-gray-600 hover:text-blood-600 transition-colors
                           px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <Globe size={15} />
                <span>
                  {LANGUAGES.find((l) => l.code === i18n.language)?.label ||
                    "EN"}
                </span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-44 bg-white
                               rounded-xl shadow-xl border border-gray-100 p-2 z-50"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            setLangOpen(false);
                          }}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                            i18n.language === lang.code
                              ? "bg-blood-600 text-white"
                              : "hover:bg-red-50 text-gray-700"
                          }`}
                        >
                          <span className="font-semibold">{lang.label}</span>
                          <span className="ml-1 opacity-70">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {donor ? (
              <Link to="/donor-dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="
        w-11 h-11 rounded-full
        bg-red-600 text-white
        flex items-center justify-center
        font-semibold text-sm
        cursor-pointer
      "
                >
                  {getInitials(donor.name)}
                </motion.div>
              </Link>
            ) : (
              <Link to="/donor-auth">
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"
                >
                  <Heart size={14} />
                  {t("nav.register")}
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className="p-2 text-blood-600 hover:text-blood-700 transition-colors"
              aria-label="Toggle language"
              type="button"
            >
              <Globe size={18} />
            </button>

            <button
              onClick={() => {
                setLangOpen(false);
                setMenuOpen((prev) => !prev);
              }}
              className="p-2 text-gray-600 hover:text-blood-600"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile lang dropdown */}
        <AnimatePresence>
          {langOpen && (
            <motion.div
              ref={mobileLangRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 right-0 px-4 pt-2 z-40"
            >
              <div className="grid grid-cols-4 gap-2 p-3 bg-white rounded-2xl shadow-xl">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`py-2 rounded-lg text-sm font-semibold ${
                      i18n.language === lang.code
                        ? "bg-blood-600 text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile nav menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden mx-4 mt-2 overflow-hidden border border-gray-100 bg-white shadow-xl rounded-2xl"
            >
              <div className="px-4 pt-3 pb-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={link.to}
                      onClick={(e) => {
                        if (location.pathname === link.to) {
                          e.preventDefault();
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }
                        setMenuOpen(false);
                      }}
                      className={`block py-2.5 px-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive(link.to)
                          ? "text-blood-600 bg-red-50"
                          : "text-gray-700 hover:text-blood-600 hover:bg-red-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {donor ? (
                  <Link to="/donor-dashboard" className="mt-3 block">
                    <button className="btn-primary w-full text-sm py-2.5">
                      My Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link to="/donor-auth" className="mt-3 block">
                    <button className="btn-primary w-full text-sm py-2.5">
                      {t("nav.register")}
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
