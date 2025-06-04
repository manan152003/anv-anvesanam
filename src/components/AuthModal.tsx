import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOCIALS = [
  { name: 'Google', icon: 'G', onClick: () => {} },
  { name: 'Facebook', icon: 'F', onClick: () => {} },
  { name: 'Twitter', icon: 'X', onClick: () => {} },
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="flex w-[800px] max-w-full rounded-[36px] overflow-hidden shadow-2xl bg-white"
        style={{ minHeight: 500 }}
      >
        {/* Left Side */}
        <div className="bg-[#e5e5e5] flex flex-col justify-between p-10 w-1/2 min-w-[320px]">
          <div>
            <h2 className="text-3xl font-serif mb-8 text-black">Welcome!</h2>
            {/* Mr Cat Illustration */}
            <div className="flex flex-col items-center mb-8">
              <svg width="100" height="160" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Head */}
                <polygon points="50,20 80,40 50,60 20,40" stroke="#222" strokeWidth="2" fill="none" />
                {/* Body */}
                <polygon points="50,60 80,120 20,120" stroke="#222" strokeWidth="2" fill="none" />
                {/* Legs */}
                <line x1="35" y1="120" x2="35" y2="150" stroke="#222" strokeWidth="2" />
                <line x1="65" y1="120" x2="65" y2="150" stroke="#222" strokeWidth="2" />
              </svg>
              <div className="flex items-center mt-2">
                <span className="text-black text-sm mr-2">Mr Cat</span>
                <svg width="40" height="20"><path d="M0,10 Q20,0 40,10" stroke="#222" strokeWidth="1" fill="none" /></svg>
              </div>
            </div>
          </div>
          <div className="text-black text-base">
            Not a member?{' '}
            <button
              className="underline hover:text-blue-700"
              onClick={() => setIsLogin(false)}
              tabIndex={0}
            >
              Register
            </button>
          </div>
        </div>
        {/* Right Side */}
        <div className="bg-white w-1/2 p-10 flex flex-col justify-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            aria-label="Close"
          >
            ✕
          </button>
          <h3 className="text-xl font-semibold mb-6 text-black">{isLogin ? 'Log in' : 'Sign up'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 text-black rounded-[28px] border border-gray-300 focus:outline-none"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Email or Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 text-black rounded-[28px] border border-gray-300 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 text-black rounded-[28px] border border-gray-300 focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700 text-sm">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                  className="mr-2"
                />
                Keep me logged in
              </label>
              <button
                type="button"
                className="text-xs text-gray-500 hover:underline"
                tabIndex={0}
              >
                Forgot your password?
              </button>
            </div>
            {error && (
              <p className="text-[#ff4d4f] text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-[12px] font-semibold hover:opacity-90 transition-opacity mt-2"
            >
              {isLogin ? 'Log in now' : 'Sign up now'}
            </button>
            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">Or sign in with</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  className="flex-1 flex items-center justify-center border border-gray-300 rounded-[8px] py-2 bg-white hover:bg-gray-100 text-gray-700 font-medium"
                  onClick={s.onClick}
                  tabIndex={0}
                >
                  {s.icon} <span className="ml-2">{s.name}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 