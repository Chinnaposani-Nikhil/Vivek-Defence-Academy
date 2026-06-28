import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle, center = false, className = '', dark = false }) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''} ${className}`}>
      {subtitle && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-3 justify-start"
          style={{ justifyContent: center ? 'center' : 'flex-start' }}
        >
          <span className={`w-12 h-[2px] ${dark ? 'bg-premium-gold' : 'bg-military-green'}`}></span>
          <span className={`font-oswald uppercase tracking-[0.2em] text-sm font-bold ${dark ? 'text-premium-gold' : 'text-military-green'}`}>
            {subtitle}
          </span>
          <span className={`w-12 h-[2px] ${dark ? 'bg-premium-gold' : 'bg-military-green'}`}></span>
        </motion.div>
      )}
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`font-bebas text-4xl md:text-5xl lg:text-6xl tracking-wider ${dark ? 'text-white' : 'text-gray-900'}`}
      >
        {title}
      </motion.h2>
    </div>
  );
};

export default SectionTitle;
