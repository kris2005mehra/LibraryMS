import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import IssueReturn from './components/IssueReturn';
import Students from './components/Students';
import Fines from './components/Fines';
import Settings from './components/Settings';

function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Books />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/issue-return"
              element={
                <ProtectedRoute allowedRoles={['admin', 'librarian']}>
                  <Layout>
                    <IssueReturn />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={['admin', 'librarian']}>
                  <Layout>
                    <Students />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fines"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Fines />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App;