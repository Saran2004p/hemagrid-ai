import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const BloodDropCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springConfig = { stiffness: 700, damping: 35, mass: 0.2 };
  const trailConfig = { stiffness: 250, damping: 28, mass: 0.45 };

  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);
  const trailSpringX = useSpring(trailX, trailConfig);
  const trailSpringY = useSpring(trailY, trailConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleHover = (e) => {
      const el = e.target;

      const clickable = el.closest(
        'button, a, input, select, textarea, [role="button"], label',
      );

      setIsHoveringClickable(Boolean(clickable));
    };

    document.addEventListener('mousemove', handleMouseMove, {
        passive: true,
    });
    document.addEventListener('mousemove', handleHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Only show on non-touch desktop devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Main blood drop cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-normal"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.85 : isHoveringClickable ? 1.15 : 1,
            rotate: isClicking ? -20 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Blood drop SVG */}
          <svg
            width="22"
            height="28"
            viewBox="0 0 22 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 0C11 0 2 10.5 2 17C2 22 6 26 11 26C16 26 20 22 20 17C20 10.5 11 0 11 0Z"
              fill={isHoveringClickable ? '#f87171' : '#ef4444'}
              opacity="0.92"
            />
            <path
              d="M11 2C11 2 4.5 11 4.5 17C4.5 18.5 5 19.8 6 20.8"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Trail dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailSpringX,
          y: trailSpringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 0.25 : 0,
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 2.5 : isHoveringClickable ? 2 : 1,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-3 h-3 rounded-full bg-red-500/50"
        />
      </motion.div>
    </>
  );
};

export default BloodDropCursor;