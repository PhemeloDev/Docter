/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to dashboard
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
              <h1 className="text-3xl font-bold text-text-primary mb-3">Welcome Back</h1>
              <p className="text-subtitle">Log in to your HealthHive account</p>
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
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-lg hover-lift focus-ring"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="spinner mr-3"></span>
                    Logging in...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
            
            <div className="mt-8 space-y-4 text-center">
              <Link 
                href="/forgot-password" 
                className="text-primary hover:text-primary-hover font-medium hover:underline focus-ring rounded px-2 py-1 inline-block transition-colors"
              >
                Forgot Password?
              </Link>
              <div className="text-content text-sm">
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  className="text-primary hover:text-primary-hover font-semibold hover:underline focus-ring rounded px-2 py-1 transition-colors"
                >
                  Sign Up
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