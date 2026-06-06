import React from "react";
import { motion } from "framer-motion";

export default function AuthSliderPanel({ mode, setMode }) {
  const isLogin = mode === "login";

  return (
    <motion.div
      animate={{
        x: isLogin ? "0%" : "100%",
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
      className="
        absolute
        top-0
        left-0
        w-1/2
        h-full
        bg-red-600
        rounded-3xl
        text-white
        z-10
        flex
        items-center
        justify-center
        shadow-2xl
      "
    >
      <div className="text-center px-8 pointer-events-auto">
        <h2 className="text-4xl font-bold mb-4">
          {isLogin
            ? "Welcome Back Donor ❤️"
            : "Become a Lifesaver ❤️"}
        </h2>

        <p className="text-white/90 mb-8 leading-relaxed">
          {isLogin
            ? "Login to view nearby blood requests and help save lives."
            : "Register to become a donor and help patients near you."}
        </p>

        <button
          onClick={() =>
            setMode(isLogin ? "register" : "login")
          }
          className="
            border-2 border-white
            px-8 py-3
            rounded-full
            font-semibold
            hover:bg-white
            hover:text-red-600
            transition-all
            duration-300
            cursor-pointer
          "
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </div>
    </motion.div>
  );
}