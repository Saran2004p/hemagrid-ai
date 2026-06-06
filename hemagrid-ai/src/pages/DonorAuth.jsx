import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DonorForm from "../components/DonorForm";
import DonorLogin from "./DonorLogin";
import AuthSliderPanel from "../components/AuthSliderPanel";

export default function DonorAuth() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const donor = localStorage.getItem("bloodbridge_donor");

    if (donor) {
      navigate("/donor-dashboard");
    }
  }, [navigate]);

  return (
    <div className="pt-24 pb-8 md:pb-24 min-h-screen bg-gray-50 px-4 flex items-start md:items-center justify-center">
      <div
        className="
relative
w-full
max-w-6xl
min-h-[760px]
md:h-[760px]
bg-white
rounded-3xl
shadow-2xl
flex
flex-col
md:block
overflow-visible md:overflow-hidden
"
      >
        {/* Mobile Toggle Buttons */}
        <div className="md:hidden flex justify-center gap-3 pt-6 px-6">
          <button
            onClick={() => setMode("login")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              mode === "login"
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              mode === "register"
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Left Form */}
        <div
          className={`
    w-full
    md:w-1/2
    h-auto
    md:h-full
    relative
    md:absolute
    z-30
    transition-all
    duration-700
    ${mode === "login" ? "md:left-1/2" : "md:left-0"}
  `}
        >
          <div className="h-full overflow-y-visible md:overflow-y-auto p-8 md:p-12">
            {mode === "login" ? <DonorLogin /> : <DonorForm />}
          </div>
        </div>

        {/* Right Form */}
        <div
          className={`hidden md:block absolute top-0 h-full w-1/2 transition-all duration-700 ${
            mode === "login" ? "left-1/2" : "left-0"
          }`}
        />

        {/* Animated Red Panel */}
        <div className="hidden md:block">
          <AuthSliderPanel mode={mode} setMode={setMode} />
        </div>
      </div>
    </div>
  );
}
