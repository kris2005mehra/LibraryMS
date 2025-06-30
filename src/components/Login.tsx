import React from 'react'
import { useNavigate } from 'react-router-dom'
import ParticleBackground from './ParticleBackground'
import { GraduationCap, Users, MessageCircle, Star } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    // Navigate directly to dashboard without authentication
    navigate('/dashboard')
  }

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

          {/* Get Started Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Ready to Learn?</h2>
            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <p className="text-blue-200 text-sm mt-4">
              Explore mentors and start learning today
            </p>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 border border-yellow-400/30">
            <p className="text-yellow-200 text-sm">
              🚀 <strong>Demo Mode:</strong> This is a demonstration version with sample data. 
              All features are functional for testing purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}