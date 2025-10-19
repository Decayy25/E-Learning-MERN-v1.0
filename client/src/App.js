import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Courses from './pages/Courses';
import Announcements from './pages/Announcements';
import Grades from './pages/Grades';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import Schedules from './pages/Schedules';
import ReportCard from './pages/ReportCard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Role-based route component
const RoleRoute = ({ children, roles }) => (
  <ProtectedRoute allowedRoles={roles}>
    {children}
  </ProtectedRoute>
);

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <main className={isAuthenticated ? 'pt-16' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Staff & Principal Routes */}
            <Route 
              path="/users" 
              element={
                <RoleRoute roles={['staff', 'principal']}>
                  <Users />
                </RoleRoute>
              } 
            />

            {/* Teacher, Staff & Principal Routes */}
            <Route 
              path="/courses" 
              element={
                <RoleRoute roles={['teacher', 'staff', 'principal']}>
                  <Courses />
                </RoleRoute>
              } 
            />
            <Route 
              path="/announcements" 
              element={
                <RoleRoute roles={['staff', 'principal']}>
                  <Announcements />
                </RoleRoute>
              } 
            />
            <Route 
              path="/grades" 
              element={
                <RoleRoute roles={['teacher', 'staff', 'principal']}>
                  <Grades />
                </RoleRoute>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <RoleRoute roles={['teacher', 'staff', 'principal']}>
                  <Assignments />
                </RoleRoute>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <RoleRoute roles={['teacher', 'staff', 'principal']}>
                  <Attendance />
                </RoleRoute>
              } 
            />
            <Route 
              path="/schedules" 
              element={
                <RoleRoute roles={['teacher', 'staff', 'principal']}>
                  <Schedules />
                </RoleRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/report-card" 
              element={
                <RoleRoute roles={['student']}>
                  <ReportCard />
                </RoleRoute>
              } 
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
