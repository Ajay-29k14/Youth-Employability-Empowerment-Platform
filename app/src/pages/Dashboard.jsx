/**
 * Dashboard Page
 * User dashboard showing profile summary, recommended jobs, and notifications
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, schemesAPI } from '../services/api';
import { 
  User, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Bell, 
  MapPin,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [latestSchemes, setLatestSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recommended jobs
        const jobsResponse = await jobsAPI.getRecommendedJobs();
        setRecommendedJobs(jobsResponse.data.data.jobs.slice(0, 3));

        // Fetch latest schemes
        const schemesResponse = await schemesAPI.getLatestSchemes(3);
        setLatestSchemes(schemesResponse.data.data.schemes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get unread notifications count
  const unreadNotifications = user?.notifications?.filter(n => !n.isRead) || [];
  const unreadCount = unreadNotifications.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your career journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Profile Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.profile?.skills?.length > 0 ? '85%' : '60%'}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Recommended Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{recommendedJobs.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Schemes</p>
                <p className="text-2xl font-bold text-gray-900">{latestSchemes.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Notifications */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Profile Summary</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <User className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {user?.location?.village}, {user?.location?.district}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {user?.profile?.educationLevel || 'Education not specified'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {user?.profile?.skills?.length || 0} skills added
                    </span>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Edit Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                {user?.notifications?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No notifications yet</p>
                ) : (
                  <div className="space-y-4">
                    {user?.notifications?.slice(-5).reverse().map((notification, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          notification.isRead ? 'bg-gray-50' : 'bg-emerald-50 border border-emerald-100'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          )}
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              notification.isRead ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recommended Jobs & Schemes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Jobs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
                <Link
                  to="/jobs"
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="p-6">
                {recommendedJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recommended jobs yet</p>
                    <p className="text-sm text-gray-400">Complete your profile for better recommendations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendedJobs.map((job) => (
                      <div
                        key={job._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.companyName}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location.district}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {job.jobType}
                              </span>
                            </div>
                            {job.requiredSkills?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Latest Government Schemes */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Latest Government Schemes</h2>
                <Link
                  to="/schemes"
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="p-6">
                {latestSchemes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No schemes available yet</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {latestSchemes.map((scheme) => (
                      <div
                        key={scheme._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
                            <FileText className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{scheme.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{scheme.category}</p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {scheme.description}
                            </p>
                            <Link
                              to={`/schemes/${scheme._id}`}
                              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 mt-3"
                            >
                              Learn More
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/jobs"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors"
                >
                  <Briefcase className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Find Jobs</span>
                </Link>
                <Link
                  to="/schemes"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors"
                >
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">View Schemes</span>
                </Link>
                <Link
                  to="/resources"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors"
                >
                  <BookOpen className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Resources</span>
                </Link>
                <Link
                  to="/profile"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors"
                >
                  <User className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">My Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
