/**
 * Admin Panel Page
 * Admin dashboard for managing jobs, schemes, and resources
 */
import React, { useState } from 'react';
import { jobsAPI, schemesAPI, resourcesAPI } from '../services/api';
import { 
  Briefcase, 
  FileText, 
  BookOpen, 
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  Clock,
  IndianRupee,
  Calendar,
  Tag,
  Star
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [jobForm, setJobForm] = useState({
    companyName: '',
    title: '',
    description: '',
    requiredSkills: '',
    educationRequired: 'Any',
    experienceRequired: 'Fresher',
    location: { village: '', district: '', state: '' },
    jobType: 'Full-time',
    salary: { min: '', max: '', period: 'monthly' },
    applyLink: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [schemeForm, setSchemeForm] = useState({
    name: '',
    description: '',
    category: 'Other',
    eligibility: { ageLimit: { min: '', max: '' }, education: '', incomeLimit: '', otherCriteria: '' },
    benefits: '',
    applicationProcess: '',
    applyLink: '',
    startDate: '',
    endDate: '',
    contactInfo: { phone: '', email: '', website: '', officeAddress: '' },
    documentsRequired: '',
    targetAudience: ''
  });

  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    category: 'Other',
    content: '',
    tags: '',
    difficultyLevel: 'Beginner',
    readTime: '5'
  });

  const tabs = [
    { id: 'jobs', label: 'Add Job', icon: Briefcase },
    { id: 'schemes', label: 'Add Scheme', icon: FileText },
    { id: 'resources', label: 'Add Resource', icon: BookOpen }
  ];

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = {
        ...jobForm,
        requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        salary: {
          min: Number(jobForm.salary.min) || 0,
          max: Number(jobForm.salary.max) || 0,
          period: jobForm.salary.period
        }
      };

      await jobsAPI.createJob(data);
      setMessage('Job created successfully!');
      setJobForm({
        companyName: '',
        title: '',
        description: '',
        requiredSkills: '',
        educationRequired: 'Any',
        experienceRequired: 'Fresher',
        location: { village: '', district: '', state: '' },
        jobType: 'Full-time',
        salary: { min: '', max: '', period: 'monthly' },
        applyLink: '',
        contactEmail: '',
        contactPhone: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = {
        ...schemeForm,
        benefits: schemeForm.benefits.split('\n').filter(Boolean),
        documentsRequired: schemeForm.documentsRequired.split('\n').filter(Boolean),
        targetAudience: schemeForm.targetAudience.split(',').map(s => s.trim()).filter(Boolean)
      };

      await schemesAPI.createScheme(data);
      setMessage('Scheme created successfully!');
      setSchemeForm({
        name: '',
        description: '',
        category: 'Other',
        eligibility: { ageLimit: { min: '', max: '' }, education: '', incomeLimit: '', otherCriteria: '' },
        benefits: '',
        applicationProcess: '',
        applyLink: '',
        startDate: '',
        endDate: '',
        contactInfo: { phone: '', email: '', website: '', officeAddress: '' },
        documentsRequired: '',
        targetAudience: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create scheme');
    } finally {
      setLoading(false);
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = {
        ...resourceForm,
        tags: resourceForm.tags.split(',').map(s => s.trim()).filter(Boolean),
        readTime: Number(resourceForm.readTime) || 5
      };

      await resourcesAPI.createResource(data);
      setMessage('Resource created successfully!');
      setResourceForm({
        title: '',
        description: '',
        category: 'Other',
        content: '',
        tags: '',
        difficultyLevel: 'Beginner',
        readTime: '5'
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage jobs, schemes, and resources</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {message.includes('success') ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <p className={message.includes('success') ? 'text-green-600' : 'text-red-600'}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage('');
                }}
                className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Job Form */}
            {activeTab === 'jobs' && (
              <form onSubmit={handleJobSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={jobForm.companyName}
                        onChange={(e) => setJobForm({...jobForm, companyName: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter job title"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter job description"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                    <input
                      type="text"
                      value={jobForm.requiredSkills}
                      onChange={(e) => setJobForm({...jobForm, requiredSkills: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., Data Entry, Computer (comma-separated)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Required</label>
                    <select
                      value={jobForm.educationRequired}
                      onChange={(e) => setJobForm({...jobForm, educationRequired: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Any">Any</option>
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({...jobForm, jobType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                    <input
                      type="text"
                      value={jobForm.location.village}
                      onChange={(e) => setJobForm({...jobForm, location: {...jobForm.location, village: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Village"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <input
                      type="text"
                      value={jobForm.location.district}
                      onChange={(e) => setJobForm({...jobForm, location: {...jobForm.location, district: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="District"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={jobForm.location.state}
                      onChange={(e) => setJobForm({...jobForm, location: {...jobForm.location, state: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                    <input
                      type="number"
                      value={jobForm.salary.min}
                      onChange={(e) => setJobForm({...jobForm, salary: {...jobForm.salary, min: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., 15000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                    <input
                      type="number"
                      value={jobForm.salary.max}
                      onChange={(e) => setJobForm({...jobForm, salary: {...jobForm.salary, max: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., 25000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Period</label>
                    <select
                      value={jobForm.salary.period}
                      onChange={(e) => setJobForm({...jobForm, salary: {...jobForm.salary, period: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link</label>
                    <input
                      type="url"
                      value={jobForm.applyLink}
                      onChange={(e) => setJobForm({...jobForm, applyLink: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={jobForm.contactEmail}
                      onChange={(e) => setJobForm({...jobForm, contactEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={jobForm.contactPhone}
                      onChange={(e) => setJobForm({...jobForm, contactPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="+91..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Job
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Scheme Form */}
            {activeTab === 'schemes' && (
              <form onSubmit={handleSchemeSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Name</label>
                    <input
                      type="text"
                      value={schemeForm.name}
                      onChange={(e) => setSchemeForm({...schemeForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter scheme name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={schemeForm.category}
                      onChange={(e) => setSchemeForm({...schemeForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Skill Development">Skill Development</option>
                      <option value="Employment">Employment</option>
                      <option value="Education">Education</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Training">Training</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={schemeForm.description}
                    onChange={(e) => setSchemeForm({...schemeForm, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter scheme description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                  <textarea
                    value={schemeForm.benefits}
                    onChange={(e) => setSchemeForm({...schemeForm, benefits: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="- Financial assistance&#10;- Training provided&#10;- Job placement support"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Process</label>
                  <textarea
                    value={schemeForm.applicationProcess}
                    onChange={(e) => setSchemeForm({...schemeForm, applicationProcess: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Explain how to apply for this scheme"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={schemeForm.startDate}
                      onChange={(e) => setSchemeForm({...schemeForm, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={schemeForm.endDate}
                      onChange={(e) => setSchemeForm({...schemeForm, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Scheme
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Resource Form */}
            {activeTab === 'resources' && (
              <form onSubmit={handleResourceSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter resource title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={resourceForm.category}
                      onChange={(e) => setResourceForm({...resourceForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Interview Tips">Interview Tips</option>
                      <option value="Resume Tips">Resume Tips</option>
                      <option value="Practice Questions">Practice Questions</option>
                      <option value="Career Guidance">Career Guidance</option>
                      <option value="Skill Building">Skill Building</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Brief description of the resource"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={resourceForm.content}
                    onChange={(e) => setResourceForm({...resourceForm, content: e.target.value})}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter the full content here..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={resourceForm.tags}
                      onChange={(e) => setResourceForm({...resourceForm, tags: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., interview, preparation, tips"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                    <select
                      value={resourceForm.difficultyLevel}
                      onChange={(e) => setResourceForm({...resourceForm, difficultyLevel: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes)</label>
                    <input
                      type="number"
                      value={resourceForm.readTime}
                      onChange={(e) => setResourceForm({...resourceForm, readTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Resource
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
