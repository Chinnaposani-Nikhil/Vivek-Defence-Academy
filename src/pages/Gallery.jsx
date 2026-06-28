import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import events from '../assets/gallery/events.png';
import events2 from '../assets/gallery/events2.png';
import training from '../assets/gallery/training.png';
import training2 from '../assets/gallery/training2.png';
import training3 from '../assets/gallery/training3.png';
import training4 from '../assets/gallery/training4.png';
import physical from '../assets/gallery/physical.png';
import physical2 from '../assets/gallery/physical2.png';
import facilities from '../assets/gallery/facilities.png';
import facilities2 from '../assets/gallery/facilities2.png';

import SEO from '../components/layout/SEO';
import SectionTitle from '../components/ui/SectionTitle';

const galleryCategories = ["All", "Training", "Physical", "Events", "Facilities"];

const galleryImages = [
  { id: 1, src: training, category: "Training", span: "col-span-1 row-span-1" },
  { id: 2, src: training2, category: "Training", span: "col-span-1 md:col-span-2 md:row-span-2" },
  { id: 3, src: training3, category: "Training", span: "col-span-1 row-span-1" },
  { id: 4, src: training4, category: "Training", span: "col-span-1 row-span-1" },
  { id: 5, src: events, category: "Events", span: "col-span-1 md:row-span-2" },
  { id: 6, src: events2, category: "Events", span: "col-span-1 md:row-span-2" },
  { id: 7, src: physical, category: "Physical", span: "col-span-1 row-span-1" },
  { id: 8, src: physical2, category: "Physical", span: "col-span-1 row-span-1" },
  { id: 9, src: facilities, category: "Facilities", span: "col-span-1 row-span-1" },
  { id: 10, src: facilities2, category: "Facilities", span: "col-span-1 md:col-span-2 md:row-span-2" },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <>
      <SEO 
        title="Gallery" 
        description="View photos and videos of our rigorous physical training, classroom sessions, facilities, and events at Vivek Defence Academy."
      />
      
      <main className="pt-32 pb-20 bg-light-bg min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="Academy Gallery" subtitle="Life At Vivek Defence" center />
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {galleryCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-oswald uppercase tracking-wider text-sm transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-military-green text-premium-gold shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-military-green hover:text-military-green'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4"
          >
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className={`relative rounded-sm overflow-hidden cursor-pointer group ${activeCategory === "All" ? image.span : 'col-span-1 row-span-1'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image.src} 
                    alt={`Gallery ${image.category}`} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-military-green/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-premium-gold font-bebas text-2xl tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {image.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-6 right-6 text-white/50 hover:text-premium-gold transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl max-h-[85vh] rounded-sm overflow-hidden flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage.src} 
                  alt="Expanded view" 
                  className="max-w-full max-h-[85vh] object-contain rounded-sm"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                  <span className="text-premium-gold font-oswald uppercase tracking-widest text-sm">
                    {selectedImage.category}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
};

export default Gallery;
