# SkillShare - College Skill Sharing Platform

A modern web application that connects college students for skill-sharing sessions, similar to Astrotalk but focused on educational mentoring.

## Features

### 🔐 Authentication
- Google OAuth integration via Supabase Auth
- Secure user management and session handling

### 👤 User Profiles
- Complete profile setup with skills, bio, and hourly rates
- Profile image support
- Availability status management
- Rating and review system

### 🔍 Browse Mentors
- Search and filter mentors by skills
- View mentor profiles with ratings and experience
- Real-time availability status

### 💳 Booking & Payments
- Stripe integration for secure payments
- Session duration selection
- Payment confirmation and session creation

### 💬 Live Chat
- Real-time messaging using Supabase Realtime
- Session-based chat rooms
- Message history and timestamps

### ⭐ Rating System
- Post-session rating and feedback
- Automatic mentor rating calculation
- Review history

### 🎨 Design Features
- Particle.js animated backgrounds
- Mobile-responsive design
- Modern UI with Tailwind CSS
- Smooth animations and transitions

### 👨‍💼 Admin Dashboard
- User management
- Session analytics
- Revenue tracking
- Platform statistics

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe
- **Animations**: tsparticles.js
- **Routing**: React Router
- **Build Tool**: Vite

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the migration files in the `supabase/migrations` folder
3. Enable Google OAuth in Supabase Auth settings
4. Set up RLS policies (included in migrations)

### 3. Stripe Setup

1. Create a Stripe account
2. Get your publishable key
3. Set up webhooks for payment processing (optional for demo)

### 4. Installation

```bash
npm install
npm run dev
```

## Database Schema

### Tables

- **profiles**: User profiles with skills and ratings
- **sessions**: Mentoring sessions with payment info
- **messages**: Real-time chat messages
- **ratings**: Session ratings and feedback

### Key Features

- Row Level Security (RLS) enabled
- Real-time subscriptions for chat
- Automatic rating calculations
- Optimized indexes for performance

## Usage

1. **Sign Up**: Use Google OAuth to create an account
2. **Profile Setup**: Complete your profile with skills and rates
3. **Browse Mentors**: Find mentors by skills and availability
4. **Book Session**: Pay for a session using Stripe
5. **Chat**: Engage in real-time chat during the session
6. **Rate**: Provide feedback after the session

## Demo Features

- Mock payment processing (for demo purposes)
- Sample mentor data
- Real-time chat functionality
- Complete user flow from signup to rating

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details