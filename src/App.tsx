import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import IssueReturn from './components/IssueReturn';
import Students from './components/Students';
import Fines from './components/Fines';
import Settings from './components/Settings';

function AppContent() {
  const { state, dispatch } = useLibrary();

  // Auto-login as admin for demo purposes
  React.useEffect(() => {
    if (!state.user && state.users.length > 0) {
      const adminUser = state.users.find(u => u.role === 'admin');
      if (adminUser) {
        dispatch({ type: 'SET_USER', payload: adminUser });
      }
    }
  }, [state.users, state.user, dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/issue-return" element={<IssueReturn />} />
        <Route path="/students" element={<Students />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/settings" element={<Settings />} />
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