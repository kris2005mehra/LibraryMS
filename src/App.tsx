import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import IssueReturn from './components/IssueReturn';
import Students from './components/Students';
import Fines from './components/Fines';
import Settings from './components/Settings';

function AppContent() {
  const { state } = useLibrary();

  // If no user is logged in, show login page
  if (!state.user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // User is logged in, show main app
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/issue-return" element={<IssueReturn />} />
        <Route path="/students" element={<Students />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <LibraryProvider>
      <Router>
        <AppContent />
      </Router>
    </LibraryProvider>
  );
}

export default App;