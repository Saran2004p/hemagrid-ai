import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const ParallaxHero = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Layer transforms at different depths
  const layer1X = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const layer1Y = useTransform(springY, [-0.5, 0.5], [-8, 8]);
  const layer2X = useTransform(springX, [-0.5, 0.5], [-24, 24]);
  const layer2Y = useTransform(springY, [-0.5, 0.5], [-16, 16]);
  const layer3X = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const layer3Y = useTransform(springY, [-0.5, 0.5], [-4, 4]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const el = ref.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Deep background layer */}
      <motion.div
        style={{ x: layer3X, y: layer3Y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-800/8 rounded-full blur-3xl" />
      </motion.div>

      {/* Mid layer — floating blood drops */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {[
          { top: '15%', left: '8%', size: 28, opacity: 0.15, delay: 0 },
          { top: '70%', left: '5%', size: 20, opacity: 0.1, delay: 0.5 },
          { top: '25%', right: '6%', size: 32, opacity: 0.12, delay: 1 },
          { top: '65%', right: '8%', size: 22, opacity: 0.08, delay: 1.5 },
          { top: '45%', left: '3%', size: 16, opacity: 0.1, delay: 2 },
        ].map((drop, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: drop.top,
              left: drop.left,
              right: drop.right,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [drop.opacity, drop.opacity * 1.5, drop.opacity],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: drop.delay,
              ease: 'easeInOut',
            }}
          >
            <svg
              width={drop.size}
              height={Math.round(drop.size * 1.27)}
              viewBox="0 0 22 28"
              fill="none"
            >
              <path
                d="M11 0C11 0 2 10.5 2 17C2 22 6 26 11 26C16 26 20 22 20 17C20 10.5 11 0 11 0Z"
                fill="#ef4444"
                opacity={drop.opacity * 6}
              />
            </svg>
          </motion.div>
        ))}
      </motion.div>

      {/* Foreground content layer */}
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxHero;