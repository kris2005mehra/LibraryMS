import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/student/StudentDashboard';
import Books from './components/Books';
import IssueReturn from './components/IssueReturn';
import Students from './components/Students';
import Fines from './components/Fines';
import Settings from './components/Settings';

function AppContent() {
  const { user, profile, loading } = useAuth();

  const handleLogin = (user: any, profile: any) => {
    // Login is handled by the AuthContext
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            profile.role === 'student' ? <StudentDashboard /> : <Dashboard />
          } 
        />
        <Route path="/books" element={<Books />} />
        {(profile.role === 'admin' || profile.role === 'librarian') && (
          <>
            <Route path="/issue-return" element={<IssueReturn />} />
            <Route path="/students" element={<Students />} />
          </>
        )}
        <Route path="/fines" element={<Fines />} />
        {profile.role === 'admin' && (
          <Route path="/settings" element={<Settings />} />
        )}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;