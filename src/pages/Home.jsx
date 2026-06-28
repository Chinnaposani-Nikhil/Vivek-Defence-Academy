import React from 'react';
import SEO from '../components/layout/SEO';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
// Placeholder for future components
import SectionTitle from '../components/ui/SectionTitle';

import { ShieldCheck, Target, Award, Users, BookOpen, Hotel, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
  return (
    <>
      <SEO 
        title="Home" 
        description="Join Vivek Defence Academy in Nizamabad. Expert coaching for Army, Navy, Air Force, Police, and Agniveer. Premium physical and written exam training."
      />
      <main>
        <Hero />
        <Stats />
        
        {/* Why Choose Vivek Defence Academy - Premium Showcase */}
        <section className="py-24 bg-light-bg relative overflow-hidden">
          {/* Ambient background blur elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-military-green/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-gold/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Academy Narrative */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-military-green/30 bg-military-green/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-military-green animate-pulse"></span>
                  <span className="text-military-green text-xs font-bold tracking-widest uppercase">Empowering Aspirants</span>
                </div>
                <h2 className="font-bebas text-5xl md:text-6xl text-gray-900 tracking-wider leading-none">
                  Forgetting Limits, <br />
                  <span className="text-military-green">Forging Officers.</span>
                </h2>
                <p className="text-gray-600 font-inter leading-relaxed text-sm font-light">
                  Vivek Defence Academy is Nizamabad's premier destination for defence exam preparation. 
                  Led by retired army veterans and subject matter experts, we prepare students physically 
                  and mentally to clear the toughest selections in the Indian Armed Forces.
                </p>
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-premium-gold/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-premium-gold" />
                    </div>
                    <span className="font-oswald text-xs uppercase tracking-wider text-gray-700">Veteran Led physical coaching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-premium-gold/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-premium-gold" />
                    </div>
                    <span className="font-oswald text-xs uppercase tracking-wider text-gray-700">Dedicated written exams mock sets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-premium-gold/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-premium-gold" />
                    </div>
                    <span className="font-oswald text-xs uppercase tracking-wider text-gray-700">Premium boarding & hostel setup</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="primary" href="/about" icon={<ChevronRight className="w-4 h-4" />}>
                    More About Us
                  </Button>
                </div>
              </div>

              {/* Right Column: Interactive Grid of Key Selling Points */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: <Users className="w-6 h-6 text-premium-gold" />,
                    title: "Ex-Defense Mentors",
                    desc: "Train directly under Subedar Majors and defense officers with decades of active service and training experience."
                  },
                  {
                    icon: <Target className="w-6 h-6 text-premium-gold" />,
                    title: "Rigorous Daily Routines",
                    desc: "Daily physical fitness tracking on military-grade grounds to clear physical efficiency tests with ease."
                  },
                  {
                    icon: <BookOpen className="w-6 h-6 text-premium-gold" />,
                    title: "NDA / CDS Study Track",
                    desc: "Interactive conceptual classes, regular mock tests, and exam tracking with our Head of Academics."
                  },
                  {
                    icon: <Hotel className="w-6 h-6 text-premium-gold" />,
                    title: "In-House Residential",
                    desc: "Nutritious defense-grade diet, clean boarding environment, secure hostel facilities, and dedicated study hours."
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-sm shadow-md border border-gray-100 hover:border-premium-gold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-military-green/10 text-military-green flex items-center justify-center rounded-full mb-5 group-hover:bg-military-green group-hover:text-premium-gold transition-colors">
                      {item.icon}
                    </div>
                    <h4 className="font-bebas text-2xl tracking-wider text-military-green mb-2">{item.title}</h4>
                    <p className="text-gray-500 font-inter text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
