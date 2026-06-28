import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollProgress = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const pathLength = useTransform(scaleProgress, [0, 1], [138.23, 0]);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      if (latest > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-[129px] right-6 z-40 pointer-events-none flex justify-center items-center"
        >
          <button
            onClick={scrollToTop}
            className="relative flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 group pointer-events-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Scroll to top"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="2.5"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="url(#progress-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="138.23"
                style={{ strokeDashoffset: pathLength }}
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <ArrowUp className="w-5 h-5 text-indigo-600 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollProgress;
