import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, User, Mail, Lock, MapPin, Phone, ArrowRight, Leaf, Apple, ShieldCheck } from 'lucide-react';
import { registerUser } from '../service/authService';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login to continue.' } });
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        form: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Full screen container for desktop */}
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Left side with branding and benefits (only visible on desktop) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-lime-500 text-white flex-col pt-32 items-center">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className='flex items-center justify-center gap-4'>
              <div className="relative">
                <Apple size={32} className="text-white" />
                <Leaf size={18} className="absolute -bottom-1 -right-1 text-lime-300" />
              </div>
              {/* Branding content */}
              <h1 className="text-4xl font-bold text-center mb-4">FreshFood</h1>
            </div>
            <p className="text-xl text-center mb-12">Nature's goodness delivered to your doorstep</p>

            {/* Benefits */}
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Fresh Delivery</h3>
                  <p className="text-green-50">Fresh food at your doorstep in minutes</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Organic Options</h3>
                  <p className="text-green-50">Wide range of organic and natural foods</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Quality Guaranteed</h3>
                  <p className="text-green-50">Only the freshest ingredients for your meals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side with form */}
        <div className="w-full lg:w-1/2 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile logo and heading (hidden on desktop) */}
            <div className="text-center mb-8 lg:hidden">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-lime-500 flex items-center justify-center shadow-md">
                    <Apple className="h-8 w-8 text-white" />
                    <Leaf className="h-4 w-4 text-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
              <p className="mt-2 text-gray-600">Sign up to start ordering fresh food</p>
            </div>

            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
              <p className="mt-2 text-gray-600">Sign up to start ordering fresh food</p>
            </div>

            {/* Registration Form */}
            <div className="py-8 px-6 rounded-lg">
              {errors.form && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="fullName">
                    Full Name*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3.5 border rounded-lg ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-sm mt-1.5">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                    Email Address*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400">
                      <Mail size={18} />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3.5 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="phone">
                    Phone Number*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400">
                      <Phone size={18} />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3.5 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                      placeholder="1234567890"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1.5">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                    Password*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3.5 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1.5">Password must be at least 8 characters long</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="confirmPassword">
                    Confirm Password*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3.5 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword}</p>}
                </div>

                {/* Terms and Conditions */}
                <div className="pt-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-700">
                        I agree to the <a href="#" className="text-green-600 hover:text-green-800">Terms of Service</a> and <a href="#" className="text-green-600 hover:text-green-800">Privacy Policy</a>
                      </label>
                      {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white py-3.5 rounded-lg font-medium transition-all flex items-center justify-center shadow-sm mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-green-600 hover:text-green-800">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Benefits Section - Only visible on mobile */}
            <div className="mt-8 grid grid-cols-2 gap-4 lg:hidden">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mx-auto mb-3">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-center text-sm font-medium text-gray-900">Fresh Delivery</h3>
                <p className="text-center text-xs text-gray-500 mt-1">Fresh food at your doorstep</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mx-auto mb-3">
                  <Leaf className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-center text-sm font-medium text-gray-900">Organic Options</h3>
                <p className="text-center text-xs text-gray-500 mt-1">Healthy and natural foods</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;