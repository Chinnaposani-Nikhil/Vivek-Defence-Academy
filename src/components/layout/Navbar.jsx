import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Success Stories', path: '/success-stories' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 glass-dark shadow-lg ${
        scrolled ? 'py-3' : 'py-4.5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-2 xl:px-6">
        <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 lg:gap-1.5 xl:gap-2 group shrink-0">
            {/* <div className="w-8 h-8 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full bg-premium-gold/20 flex items-center justify-center border border-premium-gold/50 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-5 h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-premium-gold" />
            </div> */}
           <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="VIVEK DEFENCE ACADEMY LOGO" 
          className="h-15 w-15 md:h-15 md:w-15 lg:h-15 lg:w-15 object-contain" />
          </div>

            <div className="flex flex-col">
              <span className="font-bebas text-xl lg:text-xl xl:text-2xl leading-none tracking-wider text-white">VIVEK DEFENCE</span>
              <span className="text-[9px] lg:text-[9px] xl:text-[10px] uppercase tracking-[0.2em] text-saffron font-bold">Academy</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2.5 lg:gap-3 xl:gap-6 2xl:gap-8 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-inter text-xs lg:text-xs xl:text-sm font-medium tracking-wide transition-colors hover:text-premium-gold whitespace-nowrap relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-premium-gold after:transition-all hover:after:w-full ${
                  location.pathname === link.path
                    ? 'text-premium-gold after:w-full'
                    : 'text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admission"
              className="hidden md:flex items-center gap-1 lg:gap-1 xl:gap-2 bg-military-green hover:bg-army-olive text-white px-4 py-2 lg:px-4 lg:py-2 xl:px-6 xl:py-2.5 rounded-sm font-oswald uppercase tracking-wider text-xs lg:text-xs xl:text-sm transition-all hover:shadow-[0_0_15px_rgba(75,83,32,0.5)] active:scale-95 shrink-0"
            >
              Enroll Now
              <ChevronRight className="w-3.5 h-3.5 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4" />
            </Link>

            <button
              className="lg:hidden text-2xl focus:outline-none z-50 relative"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full glass text-white">
                {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-[#0A0F16]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto pb-6"
          >
            <nav className="flex flex-col py-4 px-6 gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 px-4 text-lg font-oswald tracking-wider rounded-lg transition-all active:scale-[0.98] ${
                      location.pathname === link.path 
                        ? 'text-premium-gold bg-white/5' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4 px-2"
              >
                <Link
                  to="/admission"
                  className="w-full flex items-center justify-center gap-2 bg-military-green hover:bg-army-olive text-white px-6 py-4 rounded-lg font-oswald uppercase tracking-wider text-lg transition-all active:scale-[0.98]"
                >
                  Enroll Now
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
