import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import ParticleBackground from './ParticleBackground';
import { ChevronRight, ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-dark-bg pt-32 pb-24">
      {/* Background Image overlay */}
      {/* <div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20"
      ></div> */}
      <div
  className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
  style={{ backgroundImage: "url('/bg.png')" }}
></div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/50 to-dark-bg"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-military-green/30 to-transparent"></div>

      {/* Particles */}
      <ParticleBackground />

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-premium-gold animate-pulse"></span>
          <span className="text-premium-gold text-xs font-bold tracking-widest uppercase">Premium Defense Academy</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-bebas text-6xl md:text-7xl lg:text-8xl text-white tracking-wider leading-none mb-6 drop-shadow-2xl"
        >
          <span className="block mb-2 md:mb-4">DREAM. DEFEND.</span> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-yellow-600 block">ACHIEVE.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-inter text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light"
        >
          Expert Defence Coaching for Army, Navy, Air Force, Police & Agniveer Aspirants. 
          Join Vivek Defence Academy & Build Your Future in Armed Forces.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button 
            variant="gold" 
            size="lg" 
            href="/admission" 
            icon={<ChevronRight className="w-5 h-5" />}
            className="w-full sm:w-auto"
          >
            Enroll Now
          </Button>
          <Button 
            variant="outlineGold" 
            size="lg" 
            href="/courses"
            className="w-full sm:w-auto bg-black/20 backdrop-blur-sm"
          >
            Explore Courses
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-premium-gold opacity-70" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
