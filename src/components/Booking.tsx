import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '../lib/stripe'
import PaymentForm from './PaymentForm'
import { ArrowLeft, Star, Clock, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface Mentor {
  id: string
  name: string
  college: string
  bio: string | null
  profile_image: string | null
  skills: string[]
  hourly_rate: number
  rating: number
  total_sessions: number
}

export default function Booking() {
  const { mentorId } = useParams<{ mentorId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionDuration, setSessionDuration] = useState(1)

  useEffect(() => {
    if (mentorId) {
      fetchMentor()
    }
  }, [mentorId])

  const fetchMentor = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mentorId)
        .single()

      if (error) throw error
      setMentor(data)
    } catch (error) {
      console.error('Error fetching mentor:', error)
      toast.error('Failed to load mentor details')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!mentor || !user) return

    try {
      // Create session record
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          mentor_id: mentor.id,
          student_id: user.id,
          amount: mentor.hourly_rate * sessionDuration,
          status: 'active',
          stripe_payment_intent_id: paymentIntentId,
          started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Payment successful! Redirecting to chat...')
      navigate(`/chat/${session.id}`)
    } catch (error) {
      console.error('Error creating session:', error)
      toast.error('Payment successful but failed to create session')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Mentor not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalAmount = mentor.hourly_rate * sessionDuration

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mentor Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {mentor.profile_image ? (
                  <img
                    src={mentor.profile_image}
                    alt={mentor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                    {mentor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{mentor.name}</h2>
                <p className="text-gray-600">{mentor.college}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium text-gray-900 ml-1">
                    {mentor.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({mentor.total_sessions} sessions)
                  </span>
                </div>
              </div>
            </div>

            {mentor.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{mentor.bio}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center text-lg font-semibold text-gray-900">
              <Clock className="h-5 w-5 mr-2" />
              ₹{mentor.hourly_rate} per hour
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Session Details</h2>

            {/* Duration Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration
              </label>
              <select
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0.5}>30 minutes</option>
                <option value={1}>1 hour</option>
                <option value={1.5}>1.5 hours</option>
                <option value={2}>2 hours</option>
              </select>
            </div>

            {/* Price Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Rate per hour:</span>
                <span className="font-medium">₹{mentor.hourly_rate}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{sessionDuration} hour{sessionDuration !== 1 ? 's' : ''}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-blue-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={totalAmount}
                mentorId={mentor.id}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  )
}