'use client';

/* ==========================================================================
   Forgot Password Page
   Password recovery page for FreelanceFlow
   ========================================================================== */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

// ==========================================================================
// Forgot Password Page Component
// ==========================================================================

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================================================
  // Form Handlers
  // ==========================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, always show success
      setSuccess(true);
    } catch (error) {
      console.error('Password reset failed:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {success ? 'Check your email' : 'Reset your password'}
          </h1>
          <p className="text-gray-600 mt-2">
            {success
              ? 'We sent a password reset link to your email address'
              : 'Enter your email address and we\'ll send you a link to reset your password'
            }
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0">
          <Card.Body className="p-8">
            {success ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    If you don't see the email in your inbox, check your spam folder.
                  </p>

                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="primary"
                    className="w-full"
                  >
                    Back to sign in
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <Input
                  type="email"
                  name="email"
                  label="Email address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleInputChange}
                  error={error}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                  required
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending reset link...' : 'Send reset link'}
                </Button>
              </form>
            )}
          </Card.Body>
        </Card>

        {/* Back to Sign In Link */}
        {!success && (
          <p className="text-center mt-8 text-gray-600">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}