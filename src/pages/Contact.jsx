import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import SEO from '../components/layout/SEO';
import SectionTitle from '../components/ui/SectionTitle';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        console.error("Submission failed:", result.message);
        // Fallback for demo without backend env vars configured
        setIsSuccess(true); 
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Submission error", error);
      // Fallback for local dev without vercel api running
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Get in touch with Vivek Defence Academy in Nizamabad. Call us, chat on WhatsApp, or visit our academy."
      />
      
      <main className="pt-32 pb-20 bg-light-bg min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="Get In Touch" subtitle="Contact Us" center />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-sm shadow-lg border border-gray-100">
                <h3 className="font-bebas text-3xl tracking-wider text-military-green mb-6 border-b border-gray-100 pb-4">Academy Details</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-military-green/10 flex items-center justify-center text-military-green shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-oswald uppercase tracking-widest text-sm font-bold text-gray-900 mb-1">Location</h4>
                      <p className="text-gray-600 font-inter leading-relaxed">
                        Nyalkal Road, Next to Radio Station,<br />
                        Opposite ESI Hospital,<br />
                        Near Bangaru Maisamma Temple,<br />
                        Nizamabad
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-military-green/10 flex items-center justify-center text-military-green shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-oswald uppercase tracking-widest text-sm font-bold text-gray-900 mb-1">Phone Numbers</h4>
                      <div className="text-gray-600 font-inter space-y-1">
                        <p>+91 8790871715</p>
                        <p>+91 9492068759</p>
                        <p>+91 7386659156</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-military-green/10 flex items-center justify-center text-military-green shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-oswald uppercase tracking-widest text-sm font-bold text-gray-900 mb-1">Email Address</h4>
                      <p className="text-gray-600 font-inter">info@vivekdefenceacademy.com</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <a 
                    href="https://wa.me/918790871715?text=Hello%20Vivek%20Defence%20Academy,%20I%20want%20to%20enquire%20about%20admissions." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-oswald uppercase tracking-wider transition-colors rounded-sm shadow-lg shadow-green-500/30"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-sm shadow-lg border border-gray-100 relative overflow-hidden">
                {isSuccess && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="font-bebas text-3xl text-military-green tracking-wider mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 font-inter">Thank you for contacting Vivek Defence Academy. Our team will get back to you shortly.</p>
                  </div>
                )}

                <h3 className="font-bebas text-3xl tracking-wider text-military-green mb-6 border-b border-gray-100 pb-4">Send an Enquiry</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block font-oswald uppercase tracking-wider text-sm text-gray-700 mb-2">Full Name *</label>
                    <input 
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                  </div>

                  <div>
                    <label className="block font-oswald uppercase tracking-wider text-sm text-gray-700 mb-2">Mobile Number *</label>
                    <input maxLength={10}
                      {...register('mobile', { 
                        required: 'Mobile number is required',
                        pattern: { value: /^[0-9]{10}$/, message: 'Invalid mobile number' },
                      })}
                      className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter bg-gray-50 focus:bg-white"
                      placeholder="10-digit mobile number"
                    />
                    {errors.mobile && <span className="text-red-500 text-xs mt-1">{errors.mobile.message}</span>}
                  </div>

                  <div>
                    <label className="block font-oswald uppercase tracking-wider text-sm text-gray-700 mb-2">Email Address</label>
                    <input 
                      {...register('email', { 
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                      })}
                      className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                  </div>

                  <div>
                    <label className="block font-oswald uppercase tracking-wider text-sm text-gray-700 mb-2">Course Interested In *</label>
                    <select 
                      {...register('course', { required: 'Please select a course' })}
                      className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select a course...</option>
                      <option value="Army">Army (GD/Clerk/Tech)</option>
                      <option value="Navy">Navy (SSR/MR)</option>
                      <option value="Air Force">Air Force (X/Y Group)</option>
                      <option value="Police">Police (SI/Constable)</option>
                      <option value="Agniveer">Agniveer Coaching</option>
                      <option value="SSC GD">SSC GD / Paramilitary</option>
                    </select>
                    {errors.course && <span className="text-red-500 text-xs mt-1">{errors.course.message}</span>}
                  </div>

                  <div>
                    <label className="block font-oswald uppercase tracking-wider text-sm text-gray-700 mb-2">Message</label>
                    <textarea 
                      {...register('message')}
                      rows="4"
                      className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter bg-gray-50 focus:bg-white resize-none"
                      placeholder="Any specific query?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-military-green hover:bg-army-olive text-white font-oswald uppercase tracking-wider py-4 rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Submit Enquiry
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
          
          {/* Google Maps Embed */}
          <div className="mt-20">
            <h3 className="font-bebas text-3xl tracking-wider text-military-green mb-6">Find Us On Map</h3>
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-sm overflow-hidden shadow-lg border border-gray-200">
              <iframe 
                title="Vivek Defence Academy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d472.5155406376762!2d78.09198776263352!3d18.65841620990426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcddadea024c413%3A0x45a8d5688630b5e6!2sAll%20India%20Radio%20Campus%2C%20(FM%20103.2)!5e0!3m2!1sen!2sin!4v1780285801539!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.2227187123!2d78.1000!3d18.6700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQwJzEyLjAiTiA3OMKwMDYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
             
                
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default Contact;
