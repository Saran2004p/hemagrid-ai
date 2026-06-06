import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = '', onClick, strength = 0.3 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        mass: 0.8,
      }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative inline-flex items-center justify-center
        px-8 py-4 rounded-2xl font-bold text-base
        bg-red-600 text-white
        shadow-xl shadow-red-600/40
        transition-colors duration-200
        ${isHovered ? 'bg-red-500 shadow-red-500/50' : ''}
        cursor-pointer select-none
        ${className}
      `}
    >
      <motion.span
        animate={{ x: position.x * 0.15, y: position.y * 0.15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {children}
      </motion.span>

      {/* Glow ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-red-400/0"
        animate={{ borderColor: isHovered ? 'rgba(248, 113, 113, 0.5)' : 'rgba(248, 113, 113, 0)' }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default MagneticButton;