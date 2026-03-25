/**
 * Job Detail Page
 * Display detailed information about a specific job
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  GraduationCap, 
  IndianRupee,
  Calendar,
  Building2,
  ArrowLeft,
  ExternalLink,
  Share2,
  CheckCircle
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await jobsAPI.getJobById(id);
        setJob(response.data.data.job);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Job not found or has been removed');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.companyName}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist'}</p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-100 p-4 rounded-xl flex-shrink-0">
                <Building2 className="h-10 w-10 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-lg text-gray-600 mt-1">{job.companyName}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location.village && `${job.location.village}, `}
                    {job.location.district}, {job.location.state}
                  </span>
                  <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.jobType}
                  </span>
                  <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    {job.educationRequired}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={handleShare}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Required Skills */}
            {job.requiredSkills?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Required */}
            {job.experienceRequired && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
                <p className="text-gray-600">{job.experienceRequired}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this Job</h3>
              
              {job.salary?.min > 0 && (
                <div className="flex items-center mb-4">
                  <IndianRupee className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium text-gray-900">
                      ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                      <span className="text-sm text-gray-500"> / {job.salary.period}</span>
                    </p>
                  </div>
                </div>
              )}

              {job.deadline && (
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                    <p className="font-medium text-gray-900">
                      {new Date(job.deadline).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {job.applyLink ? (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            {/* Contact Information */}
            {(job.contactEmail || job.contactPhone) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {job.contactEmail && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a 
                        href={`mailto:${job.contactEmail}`}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        {job.contactEmail}
                      </a>
                    </div>
                  )}
                  {job.contactPhone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a 
                        href={`tel:${job.contactPhone}`}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        {job.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Posted Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-sm text-gray-500">
                Posted on {new Date(job.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How to Apply</h3>
              <p className="text-gray-600 mb-6">
                To apply for this position, please contact the employer directly using the 
                contact information provided.
              </p>
              {job.contactEmail && (
                <p className="text-sm text-gray-500 mb-2">
                  Email: <a href={`mailto:${job.contactEmail}`} className="text-emerald-600">{job.contactEmail}</a>
                </p>
              )}
              {job.contactPhone && (
                <p className="text-sm text-gray-500 mb-6">
                  Phone: <a href={`tel:${job.contactPhone}`} className="text-emerald-600">{job.contactPhone}</a>
                </p>
              )}
              <button
                onClick={() => setShowApplyModal(false)}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
