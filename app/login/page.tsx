'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DoctorLoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();



    // API authentication will be done here



    console.log('Logging in:', { email, password });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500">
      <div className="absolute top-4 left-4">
        <button
          className="text-white bg-white/30 backdrop-blur-sm bg-opacity-20 rounded-full px-4 py-2 text-sm hover:bg-opacity-30 transition hover:bg-violet-600 hover:scale-105  focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700"
          onClick={() => router.push('/')}
        >
          ← Back to Home
        </button>
      </div>

      <div className="bg-white/30 backdrop-blur-sm rounded-xl p-8 shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="text-5xl">🧑‍⚕️</div>
          <h2 className="text-white text-2xl font-bold mt-4">Doctor Login</h2>
          <p className="text-indigo-100 mt-1 text-sm">Access your healthcare dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-white text-sm mb-1 block">Email Address</label>
            <div className="flex items-center bg-white/30 backdrop-blur-sm rounded-lg p-2">
              <span className="mr-2 text-xl">📧</span>
              <input
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent outline-none w-full text-black text-2xl placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm mb-1 block">Password</label>
            <div className="flex items-center bg-white/30 backdrop-blur-sm rounded-lg p-2">
              <span className="mr-2 text-xl">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent outline-none w-full text-black text-2xl placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 focus:outline-none text-xl"
              >
                👁️
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center text-white text-sm">
            <label className="flex items-center text-xl">
              <input type="checkbox" className="mr-2 scale-125" />
              Remember me
            </label>
            <button type="button" className="text-gray-800 hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex justify-center items-center"
          >
            🚀 Sign In to Dashboard
          </button>
           <button type="button" className="text-oklch(27.9% 0.041 260.031) hover:underline" onClick={() => router.push('/register')}>
              Click here to Create Account
            </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLoginForm;
