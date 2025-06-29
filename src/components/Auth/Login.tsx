import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Book, User, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any, profile: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'admin' | 'student'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rollNo: '',
    department: '',
    contact: '',
  });

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key && url !== 'your_supabase_project_url_here' && key !== 'your_supabase_anon_key_here';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please set up your environment variables.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        // Check if user type matches
        if (userType === 'admin' && profile.role !== 'admin' && profile.role !== 'librarian') {
          throw new Error('Access denied. Admin credentials required.');
        }
        if (userType === 'student' && profile.role !== 'student') {
          throw new Error('Access denied. Student credentials required.');
        }

        onLogin(authData.user, profile);
      } else {
        // Sign up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              name: formData.name,
              role: userType,
              roll_no: userType === 'student' ? formData.rollNo : null,
              department: userType === 'student' ? formData.department : null,
              contact: formData.contact || null,
            });

          if (profileError) throw profileError;

          // Get the created profile
          const { data: profile, error: getProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (getProfileError) throw getProfileError;

          onLogin(authData.user, profile);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      rollNo: '',
      department: '',
      contact: '',
    });
    setError('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const switchUserType = (type: 'admin' | 'student') => {
    setUserType(type);
    resetForm();
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://images.shiksha.com/mediadata/images/1622116015phprRIhlq.jpeg)',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Book className="h-12 w-12 text-white mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">NIT Library</h1>
                <p className="text-white/80 text-sm">Management System</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supabase Configuration Warning */}
        {!isSupabaseConfigured() && (
          <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-md border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Database Not Connected</h4>
                <p className="text-xs text-red-700 mt-1">
                  Please click "Connect to Supabase" in the top right to set up your database connection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Type Toggle */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 mb-6 border border-white/20">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => switchUserType('student')}
              className={`flex items-center justify-center py-3 px-4 rounded-md transition-all duration-200 ${
                userType === 'student'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Student
            </button>
            <button
              onClick={() => switchUserType('admin')}
              className={`flex items-center justify-center py-3 px-4 rounded-md transition-all duration-200 ${
                userType === 'admin'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Lock className="h-5 w-5 mr-2" />
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Sign In' : 'Sign Up'} as {userType === 'admin' ? 'Admin' : 'Student'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? `Enter your ${userType} credentials to access the system`
                : `Create your ${userType} account to get started`
              }
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && userType === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your roll number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your contact number"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {/* Demo credentials info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Admin:</strong> admin@nit.ac.in / admin123</p>
              <p><strong>Student:</strong> Create a new account or use existing credentials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}