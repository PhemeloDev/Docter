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
    <main>
      <Header />
      
      <section className="section-padding-sm bg-light-gray min-h-screen flex items-center justify-center" style={{padding: '50px 20px'}}>
        <div className="container-max" style={{padding: '30px'}}>
          <div style={{clear: 'both', padding: '20px'}}></div>
          <div className="max-w-md mx-auto">
            <div className="card card-elevated" style={{padding: '40px', margin: '20px'}}>
              <div className="text-center mb-10">
                <h1 className="mb-4">Welcome Back</h1>
                <div style={{clear: 'both', padding: '8px'}}></div>
                <p className="text-subtitle">Log in to your HealthHive account</p>
              </div>
              <div style={{clear: 'both', padding: '15px'}}></div>
              
              {error && (
                <div className="mb-8 p-5 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <div style={{clear: 'both', padding: '10px'}}></div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div style={{clear: 'both', padding: '5px'}}></div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input focus-ring"
                    placeholder="Enter your email"
                    required
                    style={{margin: '8px 0'}}
                  />
                </div>
                <div style={{clear: 'both', padding: '10px'}}></div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div style={{clear: 'both', padding: '5px'}}></div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input focus-ring"
                    placeholder="Enter your password"
                    required
                    style={{margin: '8px 0'}}
                  />
                </div>
                <div style={{clear: 'both', padding: '15px'}}></div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full hover-lift focus-ring"
                  style={{margin: '15px 0', padding: '18px'}}
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
              <div style={{clear: 'both', padding: '20px'}}></div>
              
              <div className="mt-10 space-y-6 text-center">
                <Link 
                  href="/forgot-password" 
                  className="text-primary hover:text-primary-hover font-medium hover:underline focus-ring rounded px-3 py-2"
                  style={{margin: '10px 0'}}
                >
                  Forgot Password?
                </Link>
                <div style={{clear: 'both', padding: '8px'}}></div>
                <div className="text-content">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-primary hover:text-primary-hover font-semibold hover:underline focus-ring rounded px-3 py-2"
                    style={{margin: '10px'}}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{clear: 'both', padding: '25px'}}></div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 