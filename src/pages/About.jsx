import React from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Award, Users, ChevronRight } from 'lucide-react';
import SEO from '../components/layout/SEO';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';

const About = () => {
  return (
    <>
      <SEO 
        title="About Us" 
        description="Learn about Vivek Defence Academy, our mission, vision, and the expert faculty training aspirants for the Indian Armed Forces in Nizamabad."
      />
      <main className="pt-32 pb-20 bg-light-bg">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="About The Academy" subtitle="Who We Are" center />
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="font-bebas text-4xl text-military-green tracking-wider">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed font-inter">
                At Vivek Defence Academy, our mission is to forge the next generation of dedicated defenders of the nation. We provide comprehensive, discipline-based training that perfectly balances rigorous physical preparation with expert academic guidance, ensuring our students are ready for every challenge.
              </p>
              
              <h3 className="font-bebas text-4xl text-military-green tracking-wider pt-6 border-t border-gray-200">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed font-inter">
                To be India's premier defense coaching institution, recognized for producing the highest number of successful candidates who serve the country with pride, honor, and exceptional skill.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-80 md:h-[400px] lg:h-[500px] rounded-sm overflow-hidden shadow-2xl group"
            >
              <img 
                src="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop" 
                alt="Army Training" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-dark p-6 rounded-sm border border-premium-gold/30">
                  <p className="font-oswald text-premium-gold uppercase tracking-widest text-sm mb-2">Excellence</p>
                  <p className="text-white font-bebas text-3xl tracking-wider">Discipline is the bridge between goals and accomplishment.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-20">
            <SectionTitle title="Why Choose Us" subtitle="Our Excellence" center />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Users />, title: "Expert Faculty", desc: "Retired personnel and subject matter experts." },
                { icon: <Target />, title: "Daily Physical Training", desc: "Rigorous daily routines on dedicated grounds." },
                { icon: <Shield />, title: "Discipline Based", desc: "Military-style discipline and routine." },
                { icon: <Award />, title: "Mock Tests", desc: "Weekly written exams and assessments." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-sm shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group"
                >
                  <div className="w-14 h-14 bg-military-green/10 text-military-green flex items-center justify-center rounded-full mb-6 group-hover:bg-military-green group-hover:text-premium-gold transition-colors">
                    {item.icon}
                  </div>
                  <h4 className="font-bebas text-2xl tracking-wider text-military-green mb-3">{item.title}</h4>
                  <p className="text-gray-500 font-inter text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-military-green rounded-sm p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="font-bebas text-5xl text-white tracking-wider mb-6 relative z-10">Ready to Serve the Nation?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto font-inter relative z-10">
              Join Vivek Defence Academy today and take the first step towards a glorious career in the Indian Armed Forces.
            </p>
            <Button variant="gold" size="lg" href="/admission" icon={<ChevronRight />}>
              Start Your Journey
            </Button>
          </motion.div>

        </div>
      </main>
    </>
  );
};

export default About;
