import React, { useState, useEffect } from 'react'
import { Users, MessageCircle, DollarSign, Star, TrendingUp } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalSessions: number
  totalRevenue: number
  averageRating: number
}

interface User {
  id: string
  name: string
  email: string
  college: string
  total_sessions: number
  rating: number
  created_at: string
}

interface Session {
  id: string
  amount: number
  status: string
  created_at: string
  mentor: { name: string }
  student: { name: string }
}

// Demo data
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@mit.edu',
    college: 'MIT',
    total_sessions: 42,
    rating: 4.9,
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    email: 'alex@stanford.edu',
    college: 'Stanford University',
    total_sessions: 38,
    rating: 4.8,
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Priya Sharma',
    email: 'priya@iitdelhi.ac.in',
    college: 'IIT Delhi',
    total_sessions: 55,
    rating: 4.9,
    created_at: '2024-01-25T00:00:00Z'
  }
]

const demoSessions: Session[] = [
  {
    id: '1',
    amount: 35,
    status: 'completed',
    created_at: '2024-01-30T10:00:00Z',
    mentor: { name: 'Sarah Chen' },
    student: { name: 'Demo Student' }
  },
  {
    id: '2',
    amount: 30,
    status: 'completed',
    created_at: '2024-01-29T14:00:00Z',
    mentor: { name: 'Alex Rodriguez' },
    student: { name: 'John Doe' }
  },
  {
    id: '3',
    amount: 40,
    status: 'active',
    created_at: '2024-01-30T16:00:00Z',
    mentor: { name: 'Priya Sharma' },
    student: { name: 'Jane Smith' }
  }
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSessions: 0,
    totalRevenue: 0,
    averageRating: 0
  })
  const [users] = useState<User[]>(demoUsers)
  const [sessions] = useState<Session[]>(demoSessions)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Calculate stats from demo data
    const totalRevenue = demoSessions.reduce((sum, session) => sum + session.amount, 0)
    const averageRating = demoUsers.reduce((sum, user) => sum + user.rating, 0) / demoUsers.length

    setStats({
      totalUsers: demoUsers.length,
      totalSessions: demoSessions.length,
      totalRevenue,
      averageRating
    })

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.college}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {user.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{user.total_sessions} sessions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {sessions.slice(0, 5).map(session => (
                <div key={session.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.mentor.name} → {session.student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{session.amount}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'active'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}