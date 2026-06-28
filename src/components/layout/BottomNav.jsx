import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, BookOpen, Image as ImageIcon, Users, Award, Phone, UserPlus } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Courses', path: '/courses', icon: BookOpen },
  { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  { name: 'Faculty', path: '/faculty', icon: Users },
  { name: 'Stories', path: '/success-stories', icon: Award },
  { name: 'Contact', path: '/contact', icon: Phone },
  { name: 'Enroll', path: '/admission', icon: UserPlus },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0A0F16]/95 backdrop-blur-lg border-t border-white/10 z-[60] pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between px-1 h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-premium-gold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-premium-gold' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-medium tracking-wide truncate max-w-[40px] text-center">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
