import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Bell, 
  GraduationCap, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAnnouncements: 0,
    totalGrades: 0,
    recentActivities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, coursesRes, announcementsRes, gradesRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/courses'),
        axios.get('/api/announcements'),
        axios.get('/api/grades')
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalCourses: coursesRes.data.length,
        totalAnnouncements: announcementsRes.data.length,
        totalGrades: gradesRes.data.length,
        recentActivities: []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBasedStats = () => {
    if (user.role === 'student') {
      return [
        {
          title: 'My Courses',
          value: stats.totalCourses,
          icon: BookOpen,
          color: 'bg-blue-500',
          description: 'Enrolled courses'
        },
        {
          title: 'Assignments',
          value: 0,
          icon: GraduationCap,
          color: 'bg-green-500',
          description: 'Pending assignments'
        },
        {
          title: 'Grades',
          value: stats.totalGrades,
          icon: TrendingUp,
          color: 'bg-purple-500',
          description: 'Total grades received'
        },
        {
          title: 'Announcements',
          value: stats.totalAnnouncements,
          icon: Bell,
          color: 'bg-orange-500',
          description: 'Recent announcements'
        }
      ];
    }

    if (user.role === 'teacher') {
      return [
        {
          title: 'My Courses',
          value: stats.totalCourses,
          icon: BookOpen,
          color: 'bg-blue-500',
          description: 'Courses teaching'
        },
        {
          title: 'Students',
          value: stats.totalUsers,
          icon: Users,
          color: 'bg-green-500',
          description: 'Total students'
        },
        {
          title: 'Assignments',
          value: 0,
          icon: GraduationCap,
          color: 'bg-purple-500',
          description: 'Created assignments'
        },
        {
          title: 'Grades',
          value: stats.totalGrades,
          icon: TrendingUp,
          color: 'bg-orange-500',
          description: 'Grades recorded'
        }
      ];
    }

    if (user.role === 'staff' || user.role === 'principal') {
      return [
        {
          title: 'Total Users',
          value: stats.totalUsers,
          icon: Users,
          color: 'bg-blue-500',
          description: 'All users in system'
        },
        {
          title: 'Courses',
          value: stats.totalCourses,
          icon: BookOpen,
          color: 'bg-green-500',
          description: 'Active courses'
        },
        {
          title: 'Announcements',
          value: stats.totalAnnouncements,
          icon: Bell,
          color: 'bg-purple-500',
          description: 'Published announcements'
        },
        {
          title: 'Grades',
          value: stats.totalGrades,
          icon: TrendingUp,
          color: 'bg-orange-500',
          description: 'Total grades recorded'
        }
      ];
    }

    return [];
  };

  const statsCards = getRoleBasedStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getWelcomeMessage()}, {user.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome to your {user.role} dashboard. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 card-hover"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary-600" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-sm text-gray-600">{activity}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {user.role === 'student' && (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">View My Courses</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Check Assignments</span>
                  </div>
                </button>
              </>
            )}

            {user.role === 'teacher' && (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Manage Courses</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Create Assignment</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Record Attendance</span>
                  </div>
                </button>
              </>
            )}

            {(user.role === 'staff' || user.role === 'principal') && (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Manage Users</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Create Announcement</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Manage Courses</span>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;