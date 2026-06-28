import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';
import SEO from '../components/layout/SEO';
import SectionTitle from '../components/ui/SectionTitle';

const facultyMembers = [
  {
    id: 1,
    name: "Subedar Major R.K. Singh (Retd.)",
    role: "Chief Training Officer",
    image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=800&auto=format&fit=crop",
    experience: "30 Years in Indian Army",
    specialty: "Physical Fitness & Discipline"
  },
  {
    id: 2,
    name: "Capt. Vivek Sharma",
    role: "Founder & Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    experience: "Ex-Army, 15+ Years Mentoring",
    specialty: "Strategy & Career Counseling"
  },
  {
    id: 3,
    name: "Dr. A.K. Desai",
    role: "Head of Academics",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    experience: "Ph.D. Mathematics, 20 Years Teaching",
    specialty: "NDA/CDS Written Exams"
  },
  {
    id: 4,
    name: "Havildar P. Reddy",
    role: "Physical Instructor",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop",
    experience: "Ex-Para SF",
    specialty: "Obstacle Training & Endurance"
  }
];

const Faculty = () => {
  return (
    <>
      <SEO 
        title="Our Faculty" 
        description="Meet the expert trainers and ex-defense personnel at Vivek Defence Academy who guide aspirants to success."
      />
      
      <main className="pt-32 pb-20 bg-light-bg min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="Our Expert Faculty" subtitle="Mentors & Trainers" center />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facultyMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-sm overflow-hidden shadow-lg border border-gray-100 group relative"
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-military-green via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Floating specialty badge */}
                  <div className="absolute top-4 right-4 bg-premium-gold text-black text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm flex items-center gap-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Star className="w-3 h-3 fill-black" /> {member.specialty}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative bg-white transform group-hover:-translate-y-4 transition-transform duration-300 border-t-4 border-transparent group-hover:border-premium-gold">
                  <h3 className="font-bebas text-2xl tracking-wider text-military-green mb-1">{member.name}</h3>
                  <p className="font-oswald text-premium-gold uppercase tracking-widest text-sm mb-3">{member.role}</p>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-inter">
                    <Award className="w-4 h-4 text-military-green" />
                    <span>{member.experience}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-20 bg-military-green p-10 rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10">
              <h3 className="font-bebas text-4xl text-white tracking-wider mb-2">Want to join our expert team?</h3>
              <p className="text-gray-300 font-inter">We are always looking for retired defense personnel to guide our students.</p>
            </div>
            <button className="relative z-10 border-2 border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-black px-8 py-3 font-oswald uppercase tracking-widest transition-colors rounded-sm whitespace-nowrap">
              Contact Us
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Faculty;
