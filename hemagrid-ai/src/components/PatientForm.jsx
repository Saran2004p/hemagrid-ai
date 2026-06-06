// PatientForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  User,
  Droplets,
  Hash,
  Zap,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { submitBloodRequest } from "../api";
import GlowInput from "./animations/GlowInput";
import HeartbeatButton from "./animations/HeartbeatButton";
import FormCard from "./animations/FormCard";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
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

export default function PatientForm() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [result, setResult] = useState(null);
  const [urgency, setUrgency] = useState("");
  const [requiredDate, setRequiredDate] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    try {
      data.urgency = urgency;
      data.requiredDate = urgency === "planned" ? requiredDate : null;
      const res = await submitBloodRequest(data);
      if (res.success) {
        reset();
        setUrgency("");
        setRequiredDate("");
        setResult(res.data);
        setSubmitted(true);
      } else {
        setApiError(res.message || "Failed to submit request.");
      }
    } catch {
      setApiError("Could not connect to server. Please call: +91 62814 77836");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Results screen
  if (submitted && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center py-12 px-8"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 bg-blood-100 rounded-full flex items-center
                     justify-center mx-auto mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <CheckCircle size={40} className="text-blood-600" />
          </motion.div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl font-bold text-dark mb-3"
        >
          Potential Donor Match Found 🩸
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-6 leading-relaxed"
        >
          {t("patient.success")}
        </motion.p>

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6"
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Compatible donors found</span>
            <span className="font-bold text-blood-600 text-lg">
              {result.compatibleDonorsFound}
            </span>
          </div>

          {result.compatibleDonorsFound > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated match time</span>
              <span className="font-bold text-dark">
                {result.estimatedMatchMinutes} minutes
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Emails sent to donors</span>
            <span className="font-bold text-blue-600">
              {result.emailsSent || 0}
            </span>
          </div>
        </motion.div>

        {/* Donor cards */}
        {result.matchedDonors?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-red-50 rounded-xl p-5 mt-6 text-left"
          >
            <h4 className="font-semibold text-dark mb-4">
              Compatible Donors Contacted
            </h4>
            <div className="space-y-3">
              {result.matchedDonors.map((donor, i) => (
                <motion.div
                  key={donor.donorId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 4px 20px rgba(192,57,43,0.1)",
                  }}
                  className="bg-white rounded-xl p-4 border border-red-100 cursor-default"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{donor.name}</p>
                      <p className="text-sm text-gray-500">
                        {donor.bloodType} • {donor.city}
                      </p>
                    </div>
                    <div className="text-right">
                      {donor.contactShared ? (
                        <a
                          href={`tel:${donor.phone}`}
                          className="text-blood-600 font-bold"
                        >
                          {donor.phone}
                        </a>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {donor.phoneMasked}
                          </p>
                          <span className="text-xs text-gray-400">
                            Awaiting donor approval...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No donors fallback */}
        {result.compatibleDonorsFound === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4
                       text-sm text-amber-800 mb-4"
          >
            <strong>⚠️ No donors currently in your city.</strong> Please call
            directly:
            <br />
            <a href="tel:+916281477836" className="font-bold underline">
              +91 62814 77836
            </a>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            reset();
            setSubmitted(false);
            setResult(null);
          }}
          className="btn-secondary text-sm"
        >
          Submit Another Request
        </motion.button>
      </motion.div>
    );
  }

  // ✅ Form
  return (
    <FormCard className="p-8 md:p-10">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 bg-red-50 border border-red-200
                       rounded-xl p-4 text-sm text-red-700"
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Patient name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <User size={13} className="inline mr-1 text-blood-600" />
              {t("patient.name")} *
            </label>
            <motion.input
              {...register("patientName", { required: true })}
              className={`form-input ${errors.patientName ? "border-blood-400" : ""}`}
              placeholder="Patient full name"
              whileFocus={{
                boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                borderColor: "#c0392b",
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Hospital */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              🏥 {t("patient.hospital")} *
            </label>
            <motion.input
              {...register("hospital", { required: true })}
              className={`form-input ${errors.hospital ? "border-blood-400" : ""}`}
              placeholder="Hospital name & address"
              whileFocus={{
                boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                borderColor: "#c0392b",
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Blood type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Droplets size={13} className="inline mr-1 text-blood-600" />
              {t("patient.blood")} *
            </label>
            <select
              {...register("bloodType", { required: true })}
              className={`form-input ${errors.bloodType ? "border-blood-400" : ""}`}
            >
              <option value="">Select blood type</option>
              {BLOOD_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Hash size={13} className="inline mr-1 text-blood-600" />
              {t("patient.units")} *
            </label>
            <motion.input
              {...register("unitsRequired", {
                required: true,
                min: 1,
                max: 20,
              })}
              type="number"
              className={`form-input ${errors.unitsRequired ? "border-blood-400" : ""}`}
              placeholder="Number of units"
              whileFocus={{
                boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                borderColor: "#c0392b",
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Contact person */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <User size={13} className="inline mr-1 text-blood-600" />
              Contact Person Name *
            </label>
            <motion.input
              {...register("contactPerson", {
                required: "Contact person name is required",
                pattern: {
                  value: /^[A-Za-z\s.'-]+$/,
                  message: "Name should contain letters only",
                },
                minLength: { value: 2, message: "Name too short" },
              })}
              className={`form-input ${errors.contactPerson ? "border-blood-400" : ""}`}
              placeholder="Contact person name"
              whileFocus={{
                boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                borderColor: "#c0392b",
              }}
              transition={{ duration: 0.2 }}
            />
            {errors.contactPerson && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.contactPerson.message}
              </motion.p>
            )}
          </div>

          {/* Contact phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Phone size={13} className="inline mr-1 text-blood-600" />
              Contact Phone Number *
            </label>
            <motion.input
              {...register("contactPhone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter valid 10-digit Indian number",
                },
              })}
              type="tel"
              className={`form-input ${errors.contactPhone ? "border-blood-400" : ""}`}
              placeholder="10-digit mobile number"
              whileFocus={{
                boxShadow: "0 0 0 4px rgba(192,57,43,0.1)",
                borderColor: "#c0392b",
              }}
              transition={{ duration: 0.2 }}
            />
            {errors.contactPhone && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blood-500 mt-1"
              >
                {errors.contactPhone.message}
              </motion.p>
            )}
          </div>

          {/* City */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <MapPin size={13} className="inline mr-1 text-blood-600" />
              {t("patient.city")} *
            </label>
            <select
              {...register("city", { required: true })}
              className={`form-input ${errors.city ? "border-blood-400" : ""}`}
            >
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Zap size={13} className="inline mr-1 text-blood-600" />
            {t("patient.urgency")} *
          </label>
          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              type="button"
              onClick={() => {
                if (urgency === "critical") {
                  setUrgency("");
                } else {
                  setUrgency("critical");
                  setRequiredDate("");
                }
              }}
              className={`w-full h-12 rounded-xl border text-base font-medium font-sans transition-all duration-200 ${
                urgency === "critical"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-red-300"
              }`}
            >
              🚨 Critical
            </button>

            <button
              type="button"
              onClick={() => {
                if (urgency === "planned") {
                  setUrgency("");
                  setRequiredDate("");
                } else {
                  setUrgency("planned");
                }
              }}
              className={`w-full h-12 rounded-xl border text-base font-medium font-sans transition-all duration-200 ${
                urgency === "planned"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
              }`}
            >
              📅 Planned
            </button>
          </div>

          {urgency === "planned" && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Required Date
              </label>

              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="form-input"
              />
            </div>
          )}
          {errors.urgency && (
            <p className="text-xs text-blood-500 mt-1">
              Please select urgency level
            </p>
          )}
        </div>

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
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Triggering AI Pulse...
          </>
        ) : (
          <>
            <AlertCircle size={18} />
            {t('patient.submit')}
          </>
        )}
      </motion.button> */}

        <HeartbeatButton
          type="submit"
          disabled={loading}
          className="w-full py-4 text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span>Triggering AI Pulse...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <span>{t("patient.submit")}</span>
            </span>
          )}
        </HeartbeatButton>
      </motion.form>
    </FormCard>
  );
}
