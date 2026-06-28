import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  href, 
  onClick, 
  className = '', 
  icon,
  fullWidth = false,
  type = 'button'
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 font-oswald uppercase tracking-wider overflow-hidden group transition-all duration-300 rounded-sm z-10";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variants = {
    primary: "bg-military-green text-white hover:bg-army-olive hover:shadow-[0_0_20px_rgba(75,83,32,0.6)]",
    secondary: "bg-transparent border-2 border-military-green text-military-green hover:bg-military-green hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black",
    gold: "bg-premium-gold text-black hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]",
    outlineGold: "bg-transparent border-2 border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-black",
  };

  const commonClasses = `${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  // Shimmer effect
  const shimmer = (
    <span className="absolute inset-0 overflow-hidden rounded-sm pointer-events-none">
      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shimmer" />
    </span>
  );

  const innerContent = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && <span className="group-hover:translate-x-1 transition-transform duration-300">{icon}</span>}
      </span>
      {shimmer}
    </>
  );

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
    if (isExternal) {
      return (
        <a 
          href={href} 
          className={commonClasses}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {innerContent}
        </a>
      );
    }
    return (
      <Link to={href} className={commonClasses}>
        {innerContent}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={commonClasses}
    >
      {innerContent}
    </motion.button>
  );
};

export default Button;
