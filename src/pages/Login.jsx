import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Apple } from 'lucide-react';
import { useStoreContext } from '../context/StoreContext';
import { loginUser, setTokenInLocalStorage } from '../service/authService';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setToken, loadCartData } = useStoreContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await loginUser(formData);
      console.log(response.data);
      setToken(response.data.token);
      setTokenInLocalStorage(response);
      loadCartData(response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        ...errors,
        form: 'Invalid email or password. Please try again.'
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
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-lime-500 text-white flex-col justify-center items-center p-12">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                <div className="relative">
                  <Apple className="h-10 w-10 text-green-500" />
                  <svg className="h-6 w-6 text-lime-500 absolute -bottom-1 -right-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17.9999L12 14.9999L17 17.9999L16.1953 12.2059L20.5 8.41188L14.6978 7.81416L12 2.3999L9.30219 7.81416L3.5 8.41188L7.80469 12.2059L7 17.9999Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Branding content */}
            <h1 className="text-4xl font-bold text-center mb-4">FreshFruit</h1>
            <p className="text-xl text-center mb-12">Nature's ripest fruits delivered to your doorstep</p>

            {/* Benefits */}
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Seasonal Selection</h3>
                  <p className="text-green-50">Special offers on season's freshest fruits</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <Apple className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Farm to Doorstep</h3>
                  <p className="text-green-50">Freshly harvested fruits in quick time</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Organic Options</h3>
                  <p className="text-green-50">Wide range of organic and pesticide-free fruits</p>
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
                <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-lime-500 flex items-center justify-center shadow-md">
                  <Apple className="h-8 w-8 text-white" />
                  <svg className="h-4 w-4 text-white absolute -bottom-0.5 -right-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17.9999L12 14.9999L17 17.9999L16.1953 12.2059L20.5 8.41188L14.6978 7.81416L12 2.3999L9.30219 7.81416L3.5 8.41188L7.80469 12.2059L7 17.9999Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            {/* Desktop heading (hidden on mobile) */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            {/* Success message from registration if available */}
            {location.state?.message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {location.state.message}
              </div>
            )}

            {/* Login Form */}
            <div className="py-8 px-6 rounded-lg">
              {errors.form && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                    Email Address
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

                {/* Password */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                      Password
                    </label>
                    <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                      Forgot password?
                    </a>
                  </div>
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
                </div>

                {/* Remember Me */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white py-3.5 rounded-lg font-medium transition-all flex items-center justify-center shadow-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-green-600 hover:text-green-800">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            {/* Social Login - Only for mobile */}
            <div className="mt-8 lg:hidden">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;