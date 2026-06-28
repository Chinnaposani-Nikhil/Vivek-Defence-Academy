import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="bg-white p-8 md:p-10 rounded-sm shadow-2xl w-full max-w-md border-t-4 border-premium-gold">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-military-green rounded-full flex items-center justify-center mb-4 shadow-lg border-2 border-premium-gold/30">
            <Shield className="w-8 h-8 text-premium-gold" />
          </div>
          <h2 className="font-bebas text-3xl tracking-wider text-military-green">Admin Portal</h2>
          <p className="text-gray-500 text-sm font-inter uppercase tracking-widest mt-1">Vivek Defence Academy</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-sm text-sm mb-6 text-center font-inter">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1.5">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-sm border border-gray-200 focus:bg-white focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter text-gray-800"
              placeholder="admin@vivekdefence.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600">Password</label>
              <Link to="/admin/forgot-password" className="text-xs font-inter text-military-green hover:text-premium-gold transition-colors hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-sm border border-gray-200 focus:bg-white focus:border-military-green focus:ring-1 focus:ring-military-green outline-none transition-all font-inter text-gray-800"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-military-green text-white py-3.5 mt-2 font-oswald text-lg uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-army-olive transition-colors rounded-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Lock className="w-4 h-4" /> {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm font-inter text-gray-500">
            Don't have an admin account? <Link to="/admin/signup" className="text-military-green hover:text-premium-gold font-semibold transition-colors hover:underline">Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
