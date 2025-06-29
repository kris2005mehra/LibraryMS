import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Edit, Save, X, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'HTML/CSS',
  'UI/UX Design', 'Graphic Design', 'Figma', 'Photoshop', 'Illustrator',
  'Content Writing', 'Technical Writing', 'Creative Writing', 'Copywriting',
  'Data Science', 'Machine Learning', 'Web Development', 'Mobile Development',
  'Digital Marketing', 'SEO', 'Social Media', 'Video Editing', 'Photography'
]

export default function Profile() {
  const { profile, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    college: profile?.college || '',
    bio: profile?.bio || '',
    skills: profile?.skills || [],
    hourly_rate: profile?.hourly_rate || 10,
    profile_image: profile?.profile_image || '',
    is_available: profile?.is_available || true
  })

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSave = async () => {
    if (formData.skills.length === 0) {
      toast.error('Please select at least one skill')
      return
    }

    setLoading(true)
    try {
      await updateProfile(formData)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      college: profile?.college || '',
      bio: profile?.bio || '',
      skills: profile?.skills || [],
      hourly_rate: profile?.hourly_rate || 10,
      profile_image: profile?.profile_image || '',
      is_available: profile?.is_available || true
    })
    setEditing(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-white/20 overflow-hidden">
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  <p className="text-blue-100">{profile.college}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-300 font-semibold">
                      ⭐ {profile.rating.toFixed(1)}
                    </span>
                    <span className="text-blue-100 ml-2">
                      ({profile.total_sessions} sessions)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/University
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.college}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (₹)
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">₹{profile.hourly_rate}/hour</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  {editing ? (
                    <select
                      value={formData.is_available ? 'available' : 'unavailable'}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.value === 'available' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              {editing ? (
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell others about yourself, your experience, and what you can help with..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700">{profile.bio || 'No bio provided'}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              {editing ? (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
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
                    <div className="flex flex-wrap gap-2">
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
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Image */}
            {editing && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Image</h2>
                <input
                  type="url"
                  placeholder="Profile image URL"
                  value={formData.profile_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, profile_image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}