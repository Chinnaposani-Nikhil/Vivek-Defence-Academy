import React from 'react';
import CountUpPkg from 'react-countup';
const CountUp = CountUpPkg.default || CountUpPkg;

import { useInView } from 'react-intersection-observer';
import { Users, Target, ShieldCheck, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const statItems = [
  {
    id: 1,
    icon: <Users className="w-8 h-8 text-premium-gold" />,
    value: 1000,
    suffix: '+',
    label: 'Students Trained',
  },
  {
    id: 2,
    icon: <Target className="w-8 h-8 text-premium-gold" />,
    value: 95,
    suffix: '%',
    label: 'Success Rate',
  },
  {
    id: 3,
    icon: <ShieldCheck className="w-8 h-8 text-premium-gold" />,
    value: 15,
    suffix: '+',
    label: 'Expert Faculty',
  },
  {
    id: 4,
    icon: <Trophy className="w-8 h-8 text-premium-gold" />,
    value: 500,
    suffix: '+',
    label: 'Selections',
  },
];

const Stats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="py-20 bg-white relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-military-green via-premium-gold to-military-green"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-military-green opacity-0 group-hover:opacity-5 transition-opacity"></div>
                {item.icon}
              </div>
              
              <div className="font-bebas text-5xl md:text-6xl text-military-green tracking-wider mb-2 flex items-center justify-center">
                {inView ? (
                  <CountUp end={item.value} duration={2.5} separator="," />
                ) : (
                  <span>0</span>
                )}
                <span className="text-premium-gold ml-1">{item.suffix}</span>
              </div>
              
              <p className="font-oswald uppercase tracking-widest text-sm text-gray-500 font-medium">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
