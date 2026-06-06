import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Phone, Lock } from "lucide-react";

export default function DonorLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoginError("");

    const q = query(
      collection(db, "donors"),
      where("phone", "==", phone.trim())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setLoginError("Donor not found");
      return;
    }

    const donor = snapshot.docs[0].data();

    console.log("DONOR FROM FIREBASE:", donor);
    console.log("Saved password:", donor.password);
    console.log("Typed password:", password);
    console.log("Match:", String(donor.password).trim() === password.trim());

    if (String(donor.password).trim() !== password.trim()) {
      setLoginError("Incorrect password");
      return;
    }

    localStorage.setItem(
      "bloodbridge_donor",
      JSON.stringify(donor)
    );

    navigate("/donor-dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          Donor Login
        </h1>

        <p className="text-gray-500 mt-2">
          Login to view nearby blood requests
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Phone size={16} className="text-red-500" />
            Phone Number *
          </label>

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full border rounded-2xl px-4 py-4 ${
              errors.phone
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />

          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Lock size={16} className="text-red-500" />
            Password *
          </label>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className={`w-full border rounded-2xl px-4 py-4 ${
              errors.password
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* login errors */}
        {loginError && (
          <p className="text-red-500 text-sm text-center">
            {loginError}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-red-600 text-white rounded-2xl p-4 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}