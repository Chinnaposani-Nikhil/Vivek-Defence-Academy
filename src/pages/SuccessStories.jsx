import React from 'react';
import { motion } from 'framer-motion';
import { Play, Quote, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SEO from '../components/layout/SEO';
import SectionTitle from '../components/ui/SectionTitle';

const testimonials = [
  {
    id: 1,
    name: "Rahul Verma",
    selection: "Indian Army (GD)",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    quote: "The discipline and physical training at Vivek Defence Academy completely transformed me. I owe my selection to the expert faculty and their continuous guidance."
  },
  {
    id: 2,
    name: "Vikram Singh",
    selection: "Indian Air Force (X Group)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    quote: "Clearing the Air Force written exam seemed impossible until I joined the academy. The daily mock tests and conceptual clarity provided by the teachers were unmatched."
  },
  {
    id: 3,
    name: "Arjun Reddy",
    selection: "Telangana Police (SI)",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    quote: "The academy's structured program for state police exams is top-notch. The physical endurance training helped me clear the PET with ease."
  }
];

const SuccessStories = () => {
  return (
    <>
      <SEO 
        title="Success Stories" 
        description="Read inspiring success stories and testimonials from our students who have successfully joined the Indian Armed Forces."
      />
      
      <main className="pt-32 pb-20 bg-light-bg min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="Success Stories" subtitle="Our Pride" center />
          
          {/* Testimonials Slider */}
          <div className="mb-24">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="pb-16"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="!h-auto flex flex-col pt-8 pb-4">
                  <div className="bg-white p-8 rounded-sm shadow-lg border border-gray-100 relative flex flex-col justify-between flex-grow">
                    {/* Avatar */}
                    <div className="absolute -top-8 left-8">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    
                    <Quote className="w-10 h-10 text-premium-gold/20 absolute top-8 right-8" />
                    
                    <div className="pt-4 flex-grow">
                      <div className="flex text-premium-gold mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-gray-600 font-inter text-sm leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                    </div>
                    
                    <div className="mt-auto border-t border-gray-50 pt-4">
                      <h4 className="font-bebas text-xl text-military-green tracking-wider">{testimonial.name}</h4>
                      <p className="text-xs font-oswald uppercase tracking-widest text-premium-gold">{testimonial.selection}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Video Testimonials */}
          <SectionTitle title="Video Testimonials" subtitle="Hear From Them" center />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((video) => (
              <motion.div
                key={video}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-sm overflow-hidden shadow-xl group cursor-pointer"
              >
                <div className="aspect-video bg-gray-900 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop&sig=${video}`} 
                    alt="Video thumbnail" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-premium-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                      <Play className="w-6 h-6 text-black ml-1 fill-black" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 border border-t-0 border-gray-100">
                  <h4 className="font-bebas text-xl text-military-green tracking-wider">Agniveer Selection Journey</h4>
                  <p className="text-sm text-gray-500 font-inter">Watch how our student cleared the tough physicals.</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
};

export default SuccessStories;
