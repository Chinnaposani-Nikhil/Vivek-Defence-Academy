import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="bg-white p-8 md:p-10 rounded-sm shadow-2xl w-full max-w-md border-t-4 border-premium-gold">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-military-green rounded-full flex items-center justify-center mb-4 shadow-lg border-2 border-premium-gold/30">
            <KeyRound className="w-8 h-8 text-premium-gold" />
          </div>
          <h2 className="font-bebas text-3xl tracking-wider text-military-green">Reset Password</h2>
          <p className="text-gray-500 text-sm font-inter text-center mt-2 px-4">
            Enter your admin email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-sm text-sm mb-6 text-center font-inter">{error}</div>}
        {message && <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-sm text-sm mb-6 text-center font-inter">{message}</div>}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1.5">Admin Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-sm border border-gray-200 focus:bg-white focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter text-gray-800"
              placeholder="admin@vivekdefence.com"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-military-green text-white py-3.5 mt-2 font-oswald text-lg uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-army-olive transition-colors rounded-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <Link to="/admin" className="text-military-green hover:text-premium-gold font-semibold transition-colors hover:underline flex items-center justify-center gap-1.5 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
