import { motion } from "framer-motion";
import { useState } from "react";

const HeartbeatButton = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses =
    variant === "primary"
      ? "bg-red-600 hover:bg-red-700 text-white shadow-md"
      : "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white";

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      animate={
        !disabled && !isPressed
          ? {
              scale: [1, 1.015, 1],
              boxShadow: [
                "0 4px 14px rgba(220,38,38,0.18)",
                "0 6px 18px rgba(220,38,38,0.24)",
                "0 4px 14px rgba(220,38,38,0.18)",
              ],
            }
          : { scale: 1 }
      }
      transition={
        !disabled && !isPressed
          ? {
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }
          : {}
      }
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
  w-full
  flex items-center justify-center gap-3
  px-6 py-4
  rounded-2xl
  font-semibold text-base
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
  cursor-pointer select-none
  ${baseClasses}
  ${className}
`}
    >
      {children}
    </motion.button>
  );
};

export default HeartbeatButton;
