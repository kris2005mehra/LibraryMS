import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ParticleBackground from './ParticleBackground'
import MentorCard from './MentorCard'
import { Search, Filter, Star, Users, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Mentor {
  id: string
  name: string
  college: string
  bio: string | null
  profile_image: string | null
  skills: string[]
  hourly_rate: number
  is_available: boolean
  rating: number
  total_sessions: number
}

const SKILL_FILTERS = [
  'All', 'JavaScript', 'Python', 'React', 'UI/UX Design', 'Content Writing',
  'Data Science', 'Web Development', 'Graphic Design', 'Digital Marketing'
]

export default function Dashboard() {
  const { profile } = useAuth()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('All')

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [mentors, searchTerm, selectedSkill])

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_available', true)
        .neq('id', profile?.id || '')
        .order('rating', { ascending: false })

      if (error) throw error
      setMentors(data || [])
    } catch (error) {
      console.error('Error fetching mentors:', error)
      toast.error('Failed to load mentors')
    } finally {
      setLoading(false)
    }
  }

  const filterMentors = () => {
    let filtered = mentors

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedSkill !== 'All') {
      filtered = filtered.filter(mentor =>
        mentor.skills.includes(selectedSkill)
      )
    }

    setFilteredMentors(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <ParticleBackground className="absolute inset-0 opacity-30" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {profile?.name}!
                </h1>
                <p className="text-gray-600 mt-1">Find the perfect mentor for your learning journey</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mentors.length}</div>
                  <div className="text-sm text-gray-500">Available Mentors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mentors.reduce((sum, m) => sum + m.total_sessions, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search mentors by name, college, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Skill Filter */}
              <div className="md:w-64">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SKILL_FILTERS.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredMentors.length} of {mentors.length} mentors
            </div>
          </div>

          {/* Mentors Grid */}
          {filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}