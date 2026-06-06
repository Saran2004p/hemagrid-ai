import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const variants = {
  hidden: (direction) => ({
    opacity: 0,
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    scale: direction === 'scale' ? 0.92 : 1,
    filter: 'blur(6px)',
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.15,
  className = '',
  repeat = false,
}) => {
  const [ref, isVisible] = useScrollReveal({ threshold, repeat });

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={variants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;