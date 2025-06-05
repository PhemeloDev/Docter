/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      // Redirect to login
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-1 flex items-center justify-center py-20 px-4 bg-gradient-to-br from-primary-light via-white to-primary-light/50">
        <div className="w-full max-w-md">
          <div className="card card-elevated p-8 bg-white shadow-strong">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-3">Create Your Account</h1>
              <p className="text-subtitle">Join HealthHive today</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input focus-ring w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input focus-ring w-full"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input focus-ring w-full"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-lg hover-lift focus-ring"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="spinner mr-3"></span>
                    Creating Account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <div className="text-content text-sm">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary-hover font-semibold hover:underline focus-ring rounded px-2 py-1 transition-colors"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 