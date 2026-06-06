// DonorForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  User,
  Phone,
  Mail,
  Lock,
  Droplets,
  MapPin,
  Calendar,
  Languages,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { registerDonor } from "../api";
import GlowInput from "./animations/GlowInput";
import HeartbeatButton from "./animations/HeartbeatButton";
import { requestNotificationPermission } from "../firebase-messaging";
import OTPVerification from "./OTPVerification";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const LANGUAGES = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
];
const CITIES = [
  "Hyderabad",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Bengaluru",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kochi",
  "Chandigarh",
  "Coimbatore",
  "Bhubaneswar",
  "Patna",
  "Other",
];


// ✅ Reusable animated input wrapper
function AnimatedInput({ children, error }) {
  return (
    <motion.div
      animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default function DonorForm() {
  const { t } = useTranslation();

  const [showOTP, setShowOTP] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [slowMsg, setSlowMsg] = useState("");
  const slowTimer = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    setSlowMsg("");

    slowTimer.current = setTimeout(() => {
      setSlowMsg(
        "⏳ Server is waking up — this may take 30–60 seconds. Please wait...",
      );
    }, 10000);

    try {
      const fcmToken = await requestNotificationPermission();

      setPendingFormData({
        ...data,
        consent: true,
        fcmToken,
      });

      setShowOTP(true);
      setLoading(false);
      return;

      clearTimeout(slowTimer.current);
      setSlowMsg("");
      if (result.success) {
        reset();
        setSuccessMsg(result.message);
        setSubmitted(true);
      } else {
        setApiError(result.message || "Registration failed. Please try again.");
      }
    } catch {
      clearTimeout(slowTimer.current);
      setSlowMsg("");
      setApiError(
        "Could not connect to server. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp) => {
    if (otp !== "123456") {
      alert("Invalid OTP");
      return;
    }

    try {
      const result = await registerDonor(pendingFormData);

      if (result.success) {
        reset();
        setSubmitted(true);
        setShowOTP(false);
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  if (showOTP) {
    return (
      <OTPVerification
        phone={pendingFormData?.phone}
        onVerify={handleOTPVerify}
      />
    );
  }

  // ✅ Success state
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="text-center py-16 px-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center
                     justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-emerald-600" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-2xl font-bold text-dark mb-3"
        >
          You're a Lifeline! 🩸
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed"
        >
          {successMsg || t("donor.success")}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            reset();
            setSubmitted(false);
            setSuccessMsg("");
          }}
          className="mt-8 btn-secondary text-sm"
        >
          Register Another Donor
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Donor Register</h2>

        <p className="text-gray-500 mt-2">
          Register to receive blood requests near you
        </p>
      </div>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* API error */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 bg-red-50 border border-red-200
                       rounded-xl p-4 text-sm text-red-700"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slow server warning */}
        <AnimatePresence>
          {slowMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 bg-amber-50 border border-amber-200
                       rounded-xl p-4 text-sm text-amber-700"
            >
              <span className="flex-shrink-0">⏳</span>
              <div>
                <p className="font-semibold">Server is waking up...</p>
                <p className="text-xs mt-0.5">
                  The server sleeps when idle. First request takes 30–60
                  seconds. Please don't close this page!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <User size={13} className="inline mr-1 text-blood-600" />
              {t("donor.name")} *
            </label>
            <AnimatedInput error={errors.name}>
              <motion.input
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name too short" },
                })}
                className={`form-input ${errors.name ? "border-blood-400" : ""}`}
                placeholder="Your full name"
                whileFocus={{
                  boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                  borderColor: "#c0392b",
                }}
                transition={{ duration: 0.2 }}
              />
            </AnimatedInput>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Calendar size={13} className="inline mr-1 text-blood-600" />
              {t("donor.age")} *
            </label>
            <AnimatedInput error={errors.age}>
              <motion.input
                {...register("age", {
                  required: "Age required",
                  min: { value: 18, message: "Must be 18+" },
                  max: { value: 65, message: "Must be under 65" },
                })}
                type="number"
                className={`form-input ${errors.age ? "border-blood-400" : ""}`}
                placeholder="18–65"
                whileFocus={{
                  boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                  borderColor: "#c0392b",
                }}
                transition={{ duration: 0.2 }}
              />
            </AnimatedInput>
            {errors.age && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.age.message}
              </motion.p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Phone size={13} className="inline mr-1 text-blood-600" />
              {t("donor.phone")} *
            </label>
            <AnimatedInput error={errors.phone}>
              <motion.input
                {...register("phone", {
                  required: "Phone required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10-digit Indian number",
                  },
                })}
                type="tel"
                className={`form-input ${errors.phone ? "border-blood-400" : ""}`}
                placeholder="10-digit mobile number"
                whileFocus={{
                  boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                  borderColor: "#c0392b",
                }}
                transition={{ duration: 0.2 }}
              />
            </AnimatedInput>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.phone.message}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Mail size={13} className="inline mr-1 text-blood-600" />
              {t("donor.email")}
            </label>
            <motion.input
              {...register("email", {
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter valid email",
                },
              })}
              type="email"
              className={`form-input ${errors.email ? "border-blood-400" : ""}`}
              placeholder="your@email.com (recommended)"
              whileFocus={{
                boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                borderColor: "#c0392b",
              }}
              transition={{ duration: 0.2 }}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
              <Lock size={15} className="text-blood-600 shrink-0" />
              <span>Password *</span>
            </label>

            <AnimatedInput error={errors.password}>
              <motion.input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                type="password"
                className={`form-input ${errors.password ? "border-blood-400" : ""}`}
                placeholder="Create a password"
                whileFocus={{
                  boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                  borderColor: "#c0392b",
                }}
                transition={{ duration: 0.2 }}
              />
            </AnimatedInput>

            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Droplets size={13} className="inline mr-1 text-blood-600" />
              {t("donor.blood")} *
            </label>
            <select
              {...register("bloodType", { required: "Blood type required" })}
              className={`form-input ${errors.bloodType ? "border-blood-400" : ""}`}
            >
              <option value="">Select blood type</option>
              {BLOOD_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.bloodType && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.bloodType.message}
              </motion.p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <MapPin size={13} className="inline mr-1 text-blood-600" />
              {t("donor.city")} *
            </label>
            <select
              {...register("city", { required: "City required" })}
              className={`form-input ${errors.city ? "border-blood-400" : ""}`}
            >
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.city.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <Languages size={13} className="inline mr-1 text-blood-600" />
            {t("donor.language")}
          </label>
          <select {...register("preferredLanguage")} className="form-input">
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Consent */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4"
        >
          <input
            {...register("consent", { required: true })}
            type="checkbox"
            id="consent"
            className="mt-0.5 w-4 h-4 accent-blood-600 cursor-pointer"
          />
          <label
            htmlFor="consent"
            className="text-sm text-gray-600 cursor-pointer leading-relaxed"
          >
            <span className="font-semibold text-dark">
              {t("donor.available")}
            </span>{" "}
            — I consent to be contacted by BloodBridge AI when a patient in my
            area needs my blood type. I confirm I am 18–65 years old and healthy
            enough to donate.
          </label>
        </motion.div>
        {errors.consent && (
          <p className="text-blood-600 text-xs">
            Please accept the consent to register.
          </p>
        )}

        {/* Submit 
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          className="btn-primary w-full flex items-center justify-center
                   gap-2 text-base disabled:opacity-60"
        >
          {loading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              {slowMsg ? "Connecting to server..." : "Saving to database..."}
            </>
          ) : (
            <>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Heart size={18} />
              </motion.span>
              {t("donor.submit")}
            </>
          )}
        </motion.button> */}

        <HeartbeatButton
          type="submit"
          disabled={loading}
          className="w-full py-4 text-base"
        >
          {loading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              Saving to database...
            </>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Heart size={20} className="shrink-0" />
              <span>{t("donor.submit")}</span>
            </span>
          )}
        </HeartbeatButton>
      </motion.form>
    </div>
  );
}
