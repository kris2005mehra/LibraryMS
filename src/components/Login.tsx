import React from 'react'
import { useAuth } from '../context/AuthContext'
import ParticleBackground from './ParticleBackground'
import { GraduationCap, Users, MessageCircle, Star } from 'lucide-react'

export default function Login() {
  const { signInWithGoogle, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <ParticleBackground className="absolute inset-0" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-blue-400 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                SkillShare
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-200 mb-8">
              Connect with talented college students for personalized learning sessions
            </p>
            <p className="text-lg text-blue-300 max-w-2xl mx-auto">
              Get help with coding, design, writing, and more from verified student mentors. 
              Pay per session and learn at your own pace.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Expert Mentors</h3>
              <p className="text-blue-200">Connect with skilled students from top colleges</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-blue-200">Real-time messaging for instant help and guidance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Rated Sessions</h3>
              <p className="text-blue-200">Quality assured through student ratings and reviews</p>
            </div>
          </div>

          {/* Login Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full bg-white text-gray-900 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            <p className="text-blue-200 text-sm mt-4">
              Sign in to start learning or teaching
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}