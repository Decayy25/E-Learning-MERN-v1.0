import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  Users, 
  Bell, 
  GraduationCap, 
  FileText, 
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
      { path: '/profile', label: 'Profile', icon: User }
    ];

    if (user.role === 'student') {
      return [
        ...baseItems,
        { path: '/report-card', label: 'Report Card', icon: GraduationCap }
      ];
    }

    if (user.role === 'teacher') {
      return [
        ...baseItems,
        { path: '/courses', label: 'Courses', icon: BookOpen },
        { path: '/assignments', label: 'Assignments', icon: FileText },
        { path: '/grades', label: 'Grades', icon: GraduationCap },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
        { path: '/schedules', label: 'Schedules', icon: Calendar }
      ];
    }

    if (user.role === 'staff') {
      return [
        ...baseItems,
        { path: '/users', label: 'Users', icon: Users },
        { path: '/courses', label: 'Courses', icon: BookOpen },
        { path: '/announcements', label: 'Announcements', icon: Bell },
        { path: '/grades', label: 'Grades', icon: GraduationCap },
        { path: '/assignments', label: 'Assignments', icon: FileText },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
        { path: '/schedules', label: 'Schedules', icon: Calendar }
      ];
    }

    if (user.role === 'principal') {
      return [
        ...baseItems,
        { path: '/users', label: 'Users', icon: Users },
        { path: '/courses', label: 'Courses', icon: BookOpen },
        { path: '/announcements', label: 'Announcements', icon: Bell },
        { path: '/grades', label: 'Grades', icon: GraduationCap },
        { path: '/assignments', label: 'Assignments', icon: FileText },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
        { path: '/schedules', label: 'Schedules', icon: Calendar }
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">E-Learning</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                <div className="text-gray-500 capitalize">{user.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
