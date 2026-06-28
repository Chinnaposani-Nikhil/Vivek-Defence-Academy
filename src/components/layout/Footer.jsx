import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#0A0F16] text-gray-300 pt-10 pb-24 lg:pt-20 lg:pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-military-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              {/* <Shield className="w-10 h-10 text-premium-gold" /> */}
                    <div className="flex items-center gap-2">
  <img src="/Logo.png" alt="VIVEK DEFENCE ACADEMY LOGO" 
       className="h-15 w-15 md:h-15 md:w-15 lg:h-15 lg:w-15 object-contain" />
</div>
              <div className="flex flex-col">
                <span className="font-bebas text-3xl leading-none text-white tracking-wider">VIVEK DEFENCE</span>
                <span className="text-xs uppercase tracking-[0.3em] text-saffron font-bold">Academy</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Premium defense coaching for Army, Navy, Air Force, Police, and Agniveer aspirants. Join us and serve the nation with pride.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-premium-gold hover:text-black transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-premium-gold hover:text-black transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-premium-gold hover:text-black transition-colors">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden lg:block">
            <h3 className="text-lg font-oswald uppercase text-white mb-6 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-saffron rounded-full"></span> Quick Links
            </h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Courses', 'Gallery', 'Faculty', 'Success Stories'].map((item) => {
                const path = item === 'Home' ? '/' : item === 'About Us' ? '/about' : `/${item.toLowerCase().replace(' ', '-')}`;
                return (
                  <li key={item}>
                    <Link to={path} className="text-sm hover:text-premium-gold transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 text-military-green group-hover:text-premium-gold transition-colors" />
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Courses */}
          <div className="hidden lg:block">
            <h3 className="text-lg font-oswald uppercase text-white mb-6 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-india-green rounded-full"></span> Training
            </h3>
            <ul className="space-y-4">
              {['Army (GD/Clerk/Tech)', 'Navy (SSR/MR)', 'Air Force (X/Y Group)', 'Police (SI/Constable)', 'Agniveer Coaching', 'Physical Training'].map((item) => (
                <li key={item}>
                  <Link to="/courses" className="text-sm hover:text-premium-gold transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-4 h-4 text-military-green group-hover:text-premium-gold transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="hidden lg:block">
            <h3 className="text-lg font-oswald uppercase text-white mb-6 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-premium-gold rounded-full"></span> Contact Us
            </h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-premium-gold shrink-0 mt-0.5" />
                <span className="text-gray-400">Nyalkal Road, Next to Radio Station, Opposite ESI Hospital, Near Bangaru Maisamma Temple, Nizamabad</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-premium-gold shrink-0" />
                <div className="flex flex-col text-gray-400">
                  <span>+91 8790871715</span>
                  <span>+91 9492068759</span>
                  <span>+91 7386659156</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-premium-gold shrink-0" />
                <span className="text-gray-400">info@vivekdefenceacademy.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vivek Defence Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
