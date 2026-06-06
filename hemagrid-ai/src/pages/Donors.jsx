import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Heart, Shield, Clock, Award } from "lucide-react";

const BENEFITS = [
  {
    icon: Heart,
    title: "Save a Life",
    desc: "One donation supports a Thalassemia patient for 15–20 days of normal life.",
  },
  {
    icon: Shield,
    title: "Health Checkup",
    desc: "Every donor receives a free blood screening before donation.",
  },
  {
    icon: Clock,
    title: "Quick Process",
    desc: "The entire donation takes less than 30 minutes at a nearby camp.",
  },
  {
    icon: Award,
    title: "Donor Recognition",
    desc: "Earn badges, certificates and recognition from Blood Warriors Foundation.",
  },
];

export default function Donors() {
  const { t } = useTranslation();
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-blood-600 to-blood-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
            <Heart size={14} className="text-gold" />
            <span className="text-sm font-semibold">FOR DONORS</span>
          </div>
          <h1 className="font-display text-5xl font-black mb-4">
            {t("donor.title")}
          </h1>
          <p className="text-red-100 text-xl max-w-xl mx-auto">
            {t("donor.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits */}
          <div>
            <h2 className="font-display text-3xl font-bold text-dark mb-8">
              Why Donate with BloodBridge?
            </h2>
            <div className="space-y-5">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="flex gap-4 glass-card p-5">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-blood-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">
                        {b.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-amber-800 text-sm font-semibold mb-1">
                📋 Eligibility
              </p>
              <ul className="text-amber-700 text-sm space-y-1 list-disc list-inside">
                <li>Age 18–65 years</li>
                <li>Weight above 45kg</li>
                <li>Haemoglobin ≥ 12.5 g/dL</li>
                <li>No donation in last 90 days</li>
                <li>No chronic illness or recent surgery</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div
            className="
    glass-card p-10
    flex flex-col items-center justify-center
    text-center
    sticky top-28
  "
          >
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <Heart size={34} className="text-blood-600" />
            </div>

            <h2 className="font-display text-4xl font-black text-dark mb-4">
              Become a Lifesaver ❤️
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md mb-8">
              Join BloodBridge AI and help Thalassemia patients find blood
              faster. One donation can save lives.
            </p>

            <Link to="/donor-auth">
              <button
                className="
        bg-red-600 hover:bg-red-700
        text-white font-semibold
        px-8 py-4 rounded-full
        shadow-lg hover:shadow-xl
        transition duration-300
      "
              >
                Register / Login as Donor
              </button>
            </Link>

            <p className="text-sm text-gray-400 mt-4">
              Takes less than 30 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
