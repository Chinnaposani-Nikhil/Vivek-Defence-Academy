import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-100 group flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-premium-gold text-black text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
            {course.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bebas text-3xl tracking-wider text-military-green mb-2">{course.title}</h3>
        <p className="text-gray-500 font-inter text-sm mb-6 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-gray-600 text-sm">
            <Clock className="w-4 h-4 text-premium-gold" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 text-sm">
            <Users className="w-4 h-4 text-premium-gold" />
            <span>{course.eligibility}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link 
            to="/admission" 
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-military-green text-military-green font-oswald uppercase tracking-wider hover:bg-military-green hover:text-white transition-colors group/btn"
          >
            Enroll Now
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
