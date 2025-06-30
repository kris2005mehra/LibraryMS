import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Profile {
  id: string
  email: string
  name: string
  college: string
  bio: string | null
  profile_image: string | null
  skills: string[]
  hourly_rate: number
  is_available: boolean
  rating: number
  total_sessions: number
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: { id: string } | null
  profile: Profile | null
  loading: boolean
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Demo user profile
const demoProfile: Profile = {
  id: 'demo-user-1',
  email: 'demo@skillshare.com',
  name: 'Demo Student',
  college: 'Demo University',
  bio: 'I am a demo student exploring the SkillShare platform. I love learning new technologies and helping others!',
  profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  skills: ['JavaScript', 'React', 'Python', 'UI/UX Design'],
  hourly_rate: 25,
  is_available: true,
  rating: 4.8,
  total_sessions: 15,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState({ id: 'demo-user-1' })
  const [profile, setProfile] = useState<Profile>(demoProfile)
  const [loading] = useState(false)

  const updateProfile = async (updates: Partial<Profile>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setProfile(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString()
    }))
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}