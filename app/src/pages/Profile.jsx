/**
 * Profile Page
 * User profile management with skills, education, and work experience
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Languages,
  Plus,
  X,
  Edit2,
  Save,
  CheckCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, addSkill, removeSkill } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  const [formData, setFormData] = useState({
    educationLevel: user?.profile?.educationLevel || '',
    careerInterests: user?.profile?.careerInterests?.join(', ') || '',
    languages: user?.profile?.languages?.join(', ') || ''
  });

  const educationOptions = [
    '10th Pass',
    '12th Pass',
    'Diploma',
    'Graduate',
    'Post Graduate',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    const profileData = {
      educationLevel: formData.educationLevel,
      careerInterests: formData.careerInterests.split(',').map(s => s.trim()).filter(Boolean),
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean)
    };

    const result = await updateProfile(profileData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    
    const result = await addSkill(newSkill.trim());
    if (result.success) {
      setNewSkill('');
    }
  };

  const handleRemoveSkill = async (skill) => {
    await removeSkill(skill);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and professional information</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <User className="h-12 w-12 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{user?.fullName}</h3>
                  <p className="text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{user?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">
                      {user?.location?.village}, {user?.location?.district}, {user?.location?.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Education</p>
                    <p className="text-gray-900">{user?.profile?.educationLevel || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
            </div>
            <div className="p-6">
              {/* Add Skill */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {user?.profile?.skills?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No skills added yet. Add your skills to get better job recommendations.</p>
                ) : (
                  user?.profile?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
              )}
            </div>
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Level
                    </label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Select Education Level</option>
                      {educationOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Career Interests (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="careerInterests"
                      value={formData.careerInterests}
                      onChange={handleChange}
                      placeholder="e.g., Data Entry, Teaching, Sales"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages Known (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="e.g., Hindi, English, Tamil"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-700">Education Level</h3>
                    </div>
                    <p className="text-gray-900 ml-7">
                      {user?.profile?.educationLevel || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-700">Career Interests</h3>
                    </div>
                    <div className="ml-7">
                      {user?.profile?.careerInterests?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.profile.careerInterests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No career interests specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Languages className="h-5 w-5 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-700">Languages Known</h3>
                    </div>
                    <div className="ml-7">
                      {user?.profile?.languages?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.profile.languages.map((lang, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No languages specified</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Tip: Complete Your Profile</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Adding more details about your skills, education, and career interests 
                  helps us recommend better job opportunities and schemes for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
