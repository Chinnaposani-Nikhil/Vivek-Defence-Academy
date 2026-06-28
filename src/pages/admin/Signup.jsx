import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus } from 'lucide-react';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Create admin profile in Firestore
      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        role: 'admin', // Default role. Maybe a superadmin has to approve them later?
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      // 3. Navigate to dashboard (AuthContext will pick up the user and admin status)
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="bg-white p-8 md:p-10 rounded-sm shadow-2xl w-full max-w-md border-t-4 border-premium-gold">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-military-green rounded-full flex items-center justify-center mb-4 shadow-lg border-2 border-premium-gold/30">
            <UserPlus className="w-8 h-8 text-premium-gold" />
          </div>
          <h2 className="font-bebas text-3xl tracking-wider text-military-green">Admin Registration</h2>
          <p className="text-gray-500 text-sm font-inter uppercase tracking-widest mt-1">Vivek Defence Academy</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-sm text-sm mb-6 text-center font-inter">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-sm border border-gray-200 focus:bg-white focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter text-gray-800"
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          
          <div>
            <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              required
              value={phone}
              minLength={10}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-sm border border-gray-200 focus:bg-white focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter text-gray-800"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-sm border border-gray-200 focus:bg-white focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter text-gray-800"
              placeholder="admin@vivekdefence.com"
            />
          </div>

          <div>
            <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1.5">Create Password</label>
            <input 
              type="password" 
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-sm border border-gray-200 focus:bg-white focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter text-gray-800"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-gray-400 mt-1 font-inter">Minimum 6 characters required.</p>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-military-green text-white py-3.5 mt-4 font-oswald text-lg uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-army-olive transition-colors rounded-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Shield className="w-4 h-4" /> {loading ? 'Creating Account...' : 'Register as Admin'}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm font-inter text-gray-500">
            Already have an account? <Link to="/admin" className="text-military-green hover:text-premium-gold font-semibold transition-colors hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
