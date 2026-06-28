import React from 'react';
import SEO from '../components/layout/SEO';
import SectionTitle from '../components/ui/SectionTitle';
import CourseCard from '../components/courses/CourseCard';
import armygd from '../assets/gallery/armygd.png';
import navy from '../assets/gallery/navy.png';
import airforce from '../assets/gallery/airforce.png';
import police from '../assets/gallery/police.png';
import agniveer from '../assets/gallery/agniveer.png';
import sscgd from '../assets/gallery/sscgd.png';

const coursesData = [
  {
    id: 1,
    title: "Army (GD / Clerk / Tech)",
    category: "Army",
    image: armygd,
    description: "Comprehensive written and physical training for Indian Army General Duty, Clerk, and Technical entry exams.",
    duration: "6 Months",
    eligibility: "10th / 12th Pass"
  },
  {
    id: 2,
    title: "Navy (SSR / MR)",
    category: "Navy",
    image: navy,
    description: "Expert guidance for Indian Navy Senior Secondary Recruit and Matric Recruit examinations with mock tests.",
    duration: "6 Months",
    eligibility: "10th / 12th (PCM)"
  },
  {
    id: 3,
    title: "Air Force (X/Y Group)",
    category: "Air Force",
    image: airforce,
    description: "Intensive coaching for Indian Air Force X (Technical) and Y (Non-Technical) group selection process.",
    duration: "6 Months",
    eligibility: "12th Pass (PCM/Any)"
  },
  {
    id: 4,
    title: "Police (SI / Constable)",
    category: "State Police",
    image: police,
    description: "State-level police recruitment training covering written exams, physical efficiency, and medical guidance.",
    duration: "6-8 Months",
    eligibility: "12th / Graduation"
  },
  {
    id: 5,
    title: "Agniveer Coaching",
    category: "Agnipath",
    image: agniveer,
    description: "Specialized training program aligned with the Agnipath scheme for Army, Navy, and Air Force.",
    duration: "4 Months",
    eligibility: "10th / 12th Pass"
  },
  {
    id: 6,
    title: "SSC GD / Paramilitary",
    category: "Central Police",
    image: sscgd,
    description: "Dedicated coaching for CRPF, CISF, BSF, ITBP through the SSC GD examination.",
    duration: "6 Months",
    eligibility: "10th Pass"
  }
];

const Courses = () => {
  return (
    <>
      <SEO 
        title="Our Courses" 
        description="Explore our specialized training courses for Indian Army, Navy, Air Force, Police, and Agniveer. Written exam coaching and physical fitness training."
      />
      
      {/* Page Header */}
      <section className="pt-32 pb-20 bg-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1563200788-2929fb07ffc9?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <SectionTitle 
            title="Training Programs" 
            subtitle="Choose Your Path" 
            center 
            dark 
            className="mb-0"
          />
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-light-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesData.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Physical Training Banner */}
      <section className="py-20 bg-military-green relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 transform -skew-x-12 translate-x-20 hidden md:block"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl">
            <h2 className="font-bebas text-5xl text-white tracking-wider mb-4">Dedicated Physical Training</h2>
            <p className="text-gray-300 font-inter text-lg mb-8">
              Every course includes mandatory daily physical training led by expert instructors on our dedicated grounds. We ensure you meet all physical efficiency test (PET) requirements.
            </p>
            <ul className="space-y-3 text-white font-oswald tracking-widest mb-8">
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-premium-gold rounded-full"></span> 1600m Running Practice</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-premium-gold rounded-full"></span> Pull-ups & Push-ups</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-premium-gold rounded-full"></span> Long Jump & High Jump</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-premium-gold rounded-full"></span> Medical Pre-Screening</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Courses;
