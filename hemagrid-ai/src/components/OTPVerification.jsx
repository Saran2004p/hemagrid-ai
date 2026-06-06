import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function OTPVerification({
  phone,
  onVerify,
}) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="max-w-md mx-auto py-10 text-center">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
        }}
        className="w-20 h-20 bg-red-100 rounded-full
                   flex items-center justify-center
                   mx-auto mb-6"
      >
        <Heart
          size={36}
          className="text-red-600"
          fill="currentColor"
        />
      </motion.div>

      <h2 className="text-3xl font-bold mb-3">
        Verify OTP
      </h2>

      <p className="text-gray-500 mb-6">
        Verification code sent to {phone}
      </p>

      <input
        type="text"
        maxLength="6"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value)
        }
        placeholder="Enter 6 digit OTP"
        className="
          w-full
          text-center
          tracking-[10px]
          text-2xl
          border
          rounded-2xl
          p-4
        "
      />

      <button
        onClick={() => onVerify(otp)}
        className="
          w-full mt-5
          bg-red-600
          text-white
          rounded-2xl
          py-4
          font-semibold
        "
      >
        Verify OTP
      </button>

      <p className="mt-4 text-sm text-gray-500">
        {timer > 0
          ? `Resend OTP in ${timer}s`
          : "Resend OTP"}
      </p>
    </div>
  );
}