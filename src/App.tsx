import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import IssueReturn from './components/IssueReturn';
import Students from './components/Students';
import Fines from './components/Fines';
import Settings from './components/Settings';

function App() {
  return (
    <LibraryProvider>
      <Router>
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
      </Router>
    </LibraryProvider>
  );
}

export default App;