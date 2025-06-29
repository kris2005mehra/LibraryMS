import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MapPin, Clock, MessageCircle } from 'lucide-react'

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

interface MentorCardProps {
  mentor: Mentor
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const navigate = useNavigate()

  const handleBookSession = () => {
    navigate(`/booking/${mentor.id}`)
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Profile Header */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {mentor.profile_image ? (
              <img
                src={mentor.profile_image}
                alt={mentor.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {mentor.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {mentor.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{mentor.college}</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {mentor.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({mentor.total_sessions} sessions)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p className="text-sm text-gray-600 mt-4 line-clamp-2">
            {mentor.bio}
          </p>
        )}

        {/* Skills */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {mentor.skills.slice(0, 3).map(skill => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
            {mentor.skills.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{mentor.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Rate and Availability */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>₹{mentor.hourly_rate}/hour</span>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            mentor.is_available
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {mentor.is_available ? 'Available' : 'Busy'}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookSession}
          disabled={!mentor.is_available}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {mentor.is_available ? 'Book Session' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  )
}