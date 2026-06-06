import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { motion } from 'framer-motion';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const AnimatedCounter = ({
  end,
  duration = 2200,
  prefix = '',
  suffix = '',
  label = '',
  icon = '',
  delay = 0,
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.3 });
  const animationRef = useRef(null);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);

      const startTime = performance.now() + delay;
      let started = false;

      const animate = (currentTime) => {
        if (currentTime < startTime) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        if (!started) started = true;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = eased * end;

        setCount(current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, hasAnimated, end, duration, delay]);

  const formatNumber = (num) => {
    if (decimals > 0) return num.toFixed(decimals);
    return Math.floor(num).toLocaleString('en-IN');
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="text-center group"
    >
      {icon && (
        <motion.div
          animate={isVisible ? { scale: [0, 1.3, 1], rotate: [0, -10, 0] } : {}}
          transition={{ duration: 0.5, delay: delay / 1000 + 0.2 }}
          className="text-3xl mb-3"
        >
          {icon}
        </motion.div>
      )}

      <div className="relative inline-block">
        <motion.span
          className="text-4xl md:text-5xl font-black text-white tracking-tight"
        >
          {prefix}
          {formatNumber(count)}
          {suffix}
        </motion.span>

        {/* Underline pulse */}
        <motion.div
          className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-red-600 to-red-400 rounded-full"
          animate={isVisible ? { width: ['0%', '100%'] } : { width: '0%' }}
          transition={{ duration: 0.8, delay: delay / 1000 + 0.4, ease: 'easeOut' }}
        />
      </div>

      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay / 1000 + 0.3 }}
          className="text-gray-400 text-sm mt-3 font-medium uppercase tracking-wider"
        >
          {label}
        </motion.p>
      )}
    </motion.div>
  );
};

export default AnimatedCounter;