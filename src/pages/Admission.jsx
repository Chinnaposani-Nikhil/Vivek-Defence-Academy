import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, PhoneCall, Users, Video, CheckSquare, ChevronRight, X, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import SEO from '../components/layout/SEO';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';

const steps = [
  {
    id: 1,
    title: "Register Online / Offline",
    desc: "Fill out our quick enquiry form online or visit our academy in Nizamabad to collect the application form.",
    icon: <ClipboardList className="w-8 h-8 text-premium-gold" />
  },
  {
    id: 2,
    title: "Contact From Academy",
    desc: "Our admission counselor will call you within 24 hours to understand your goals and background.",
    icon: <PhoneCall className="w-8 h-8 text-premium-gold" />
  },
  {
    id: 3,
    title: "Expert Counseling",
    desc: "A detailed session with our experts to decide the right course (Army, Navy, Air Force, Police) based on your age and qualifications.",
    icon: <Users className="w-8 h-8 text-premium-gold" />
  },
  {
    id: 4,
    title: "Demo Session & Physical Assessment",
    desc: "Attend a free demo class and undergo a basic physical fitness check by our retired defense instructors.",
    icon: <Video className="w-8 h-8 text-premium-gold" />
  },
  {
    id: 5,
    title: "Admission Confirmation",
    desc: "Submit your documents, pay the fees, and secure your seat. Hostel facility allocation (if required) happens here.",
    icon: <CheckSquare className="w-8 h-8 text-premium-gold" />
  }
];

const COURSES = ['Army (GD)', 'Navy', 'Air Force', 'Police (SI/Constable)', 'SSC GD', 'Agniveer', 'Physical Training'];

const Admission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: COURSES[0],
    fathersName: '',
    dob: '',
    education: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'admissions'), {
        ...formData,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
        setFormData({
          name: '', phone: '', email: '', course: COURSES[0],
          fathersName: '', dob: '', education: '', address: ''
        });
      }, 3000);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Failed to submit application. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Admission Process" 
        description="Learn about the step-by-step admission process at Vivek Defence Academy. Enroll today for premium defense coaching."
      />
      
      <main className="pt-32 pb-20 bg-light-bg min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="Admission Process" subtitle="Join The Elite" center />

          {/* Timeline */}
          <div className="max-w-4xl mx-auto relative mt-16 mb-24">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-military-green/20 -translate-x-1/2"></div>
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`md:w-1/2 w-full ${index % 2 !== 0 ? 'md:text-left' : 'md:text-right text-left'}`}>
                    <div className="bg-white p-6 rounded-sm shadow-md border border-gray-100 hover:border-premium-gold transition-colors duration-300 relative group">
                      <span className="absolute -top-3 sm:-top-4 -left-2 sm:-left-4 text-6xl font-bebas text-gray-100 group-hover:text-military-green/5 transition-colors -z-10 select-none">
                        0{step.id}
                      </span>
                      <h3 className="font-bebas text-2xl tracking-wider text-military-green mb-2">{step.title}</h3>
                      <p className="text-gray-600 font-inter text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 hidden md:flex w-16 h-16 rounded-full bg-military-green border-4 border-light-bg items-center justify-center shrink-0 shadow-xl">
                    {step.icon}
                  </div>
                  <div className="hidden md:block md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-white p-12 rounded-sm shadow-2xl border-t-4 border-premium-gold relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-military-green/5 rounded-full blur-3xl"></div>
            <h2 className="font-bebas text-4xl md:text-5xl tracking-wider text-military-green mb-4">Start Your Training Today</h2>
            <p className="text-gray-600 font-inter mb-8">
              Admissions are open for the upcoming batches. Limited seats available to ensure personalized attention and optimal physical training standards.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-military-green hover:bg-army-olive text-white px-8 py-3 rounded-sm font-oswald tracking-wider uppercase text-lg transition-colors shadow-lg flex items-center gap-2"
              >
                Apply Now <ChevronRight className="w-5 h-5" />
              </button>
              <Button href="tel:+918790871715" variant="secondary" size="lg">
                Call: 8790871715
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Application Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-sm shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-military-green text-white p-5 flex justify-between items-center z-10">
                <h3 className="font-bebas text-2xl tracking-wider">Admission Application</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                {success ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckSquare className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-bebas text-3xl text-military-green tracking-wider mb-2">Application Submitted!</h4>
                    <p className="text-gray-600 font-inter">Our admission counselor will contact you shortly to process your application.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 font-inter text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Full Name *</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors" placeholder="Enter student's name" />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Target Course *</label>
                        <select name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors">
                          {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Phone Number *</label>
                        <input type="tel" name="phone" minLength={10} maxLength={10} required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors" placeholder="10-digit mobile number" />
                      </div>

                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors" placeholder="Optional" />
                      </div>

                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Father's Name *</label>
                        <input type="text" name="fathersName" required value={formData.fathersName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors" placeholder="Enter father's name" />
                      </div>

                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Date of Birth *</label>
                        <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Highest Education Qualification *</label>
                        <input type="text" name="education" required value={formData.education} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors" placeholder="e.g. 12th Pass, 10th Pass, Degree" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Complete Address *</label>
                        <textarea name="address" required rows="3" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:border-military-green focus:bg-white outline-none transition-colors resize-none" placeholder="Enter your full residential address..."></textarea>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-oswald uppercase tracking-wider hover:bg-gray-100 transition-colors rounded-sm">
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-military-green hover:bg-army-olive text-white font-oswald uppercase tracking-wider transition-colors rounded-sm shadow-md flex items-center gap-2 disabled:opacity-70">
                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Admission;
