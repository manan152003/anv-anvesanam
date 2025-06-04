import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from: string;
  url?: string;
}

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path and URL from location state
  const { from, url } = (location.state as LocationState) || { from: '/enter-details' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, name, username);
      // Redirect to login page with the original destination and URL
      navigate('/login', { state: { from, url }, replace: true });
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-[#1F1F1F] p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#DFD0B8]">Create your account</h2>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-[#DFD0B8]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-[#DFD0B8] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]"
              />
            </div>
            <div>
              <label htmlFor="username" className="text-[#DFD0B8]">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-[#DFD0B8] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]"
                placeholder="Choose a unique username"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-[#DFD0B8]">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-[#DFD0B8] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-[#DFD0B8]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-[#DFD0B8] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#141414] bg-[#DFD0B8] hover:bg-[#C4B5A0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DFD0B8]"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-[#DFD0B8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#DFD0B8] hover:text-[#C4B5A0] underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 