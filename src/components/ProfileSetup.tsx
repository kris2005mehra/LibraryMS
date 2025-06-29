import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Upload, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'HTML/CSS',
  'UI/UX Design', 'Graphic Design', 'Figma', 'Photoshop', 'Illustrator',
  'Content Writing', 'Technical Writing', 'Creative Writing', 'Copywriting',
  'Data Science', 'Machine Learning', 'Web Development', 'Mobile Development',
  'Digital Marketing', 'SEO', 'Social Media', 'Video Editing', 'Photography'
]

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    college: '',
    bio: '',
    skills: [] as string[],
    hourly_rate: 10,
    profile_image: user?.user_metadata?.avatar_url || ''
  })

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.skills.length === 0) {
      toast.error('Please select at least one skill')
      return
    }

    setLoading(true)
    try {
      await updateProfile({
        ...formData,
        is_available: true,
        rating: 5.0,
        total_sessions: 0
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">Tell us about yourself to get started</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.profile_image ? (
                    <img
                      src={formData.profile_image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Profile image URL"
                  value={formData.profile_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, profile_image: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College/University *
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell others about yourself, your experience, and what you can help with..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.skills.includes(skill)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {formData.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (₹) *
              </label>
              <input
                type="number"
                min="5"
                max="1000"
                required
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Set your rate per hour for mentoring sessions
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}