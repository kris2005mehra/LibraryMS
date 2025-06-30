import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Send, ArrowLeft, Clock, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  sender_name: string
}

interface Session {
  id: string
  mentor_id: string
  student_id: string
  amount: number
  status: string
  started_at: string
  ended_at: string | null
  mentor: {
    name: string
    profile_image: string | null
  }
  student: {
    name: string
    profile_image: string | null
  }
}

export default function Chat() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionId) {
      // Create demo session data
      const demoSession: Session = {
        id: sessionId,
        mentor_id: 'mentor-1',
        student_id: 'demo-user-1',
        amount: 35,
        status: 'active',
        started_at: new Date().toISOString(),
        ended_at: null,
        mentor: {
          name: 'Sarah Chen',
          profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        student: {
          name: 'Demo Student',
          profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      }

      // Create demo messages
      const demoMessages: Message[] = [
        {
          id: '1',
          sender_id: 'mentor-1',
          content: 'Hi! Welcome to our session. What would you like to learn today?',
          created_at: new Date(Date.now() - 300000).toISOString(),
          sender_name: 'Sarah Chen'
        },
        {
          id: '2',
          sender_id: 'demo-user-1',
          content: 'Hello! I\'m interested in learning React hooks and state management.',
          created_at: new Date(Date.now() - 240000).toISOString(),
          sender_name: 'Demo Student'
        },
        {
          id: '3',
          sender_id: 'mentor-1',
          content: 'Great choice! Let\'s start with useState and useEffect. These are the most commonly used hooks.',
          created_at: new Date(Date.now() - 180000).toISOString(),
          sender_name: 'Sarah Chen'
        }
      ]

      setSession(demoSession)
      setMessages(demoMessages)
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user || !sessionId) return

    const message: Message = {
      id: Date.now().toString(),
      sender_id: user.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender_name: 'Demo Student'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate mentor response after a delay
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender_id: 'mentor-1',
        content: 'That\'s a great question! Let me explain that concept...',
        created_at: new Date().toISOString(),
        sender_name: 'Sarah Chen'
      }
      setMessages(prev => [...prev, mentorResponse])
    }, 2000)
  }

  const endSession = async () => {
    if (!sessionId) return

    toast.success('Session ended successfully')
    navigate(`/rating/${sessionId}`)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Session not found</h2>
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

  const otherUser = session.mentor_id === user?.id ? session.student : session.mentor
  const isSessionActive = session.status === 'active'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                {otherUser.profile_image ? (
                  <img
                    src={otherUser.profile_image}
                    alt={otherUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {otherUser.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{otherUser.name}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>₹{session.amount} session</span>
                </div>
              </div>
            </div>
          </div>
          
          {isSessionActive && (
            <button
              onClick={endSession}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      {isSessionActive && (
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isSessionActive && (
        <div className="bg-gray-100 p-4 text-center">
          <p className="text-gray-600">This session has ended</p>
        </div>
      )}
    </div>
  )
}