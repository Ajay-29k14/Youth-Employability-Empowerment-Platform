/**
 * Scheme Detail Page
 * Display detailed information about a government scheme
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schemesAPI } from '../services/api';
import { 
  FileText, 
  ArrowLeft,
  CheckCircle,
  Users,
  Calendar,
  Phone,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
  Share2,
  FileCheck,
  AlertCircle
} from 'lucide-react';

const SchemeDetail = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);
        const response = await schemesAPI.getSchemeById(id);
        setScheme(response.data.data.scheme);
      } catch (error) {
        console.error('Error fetching scheme:', error);
        setError('Scheme not found or has been removed');
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: scheme.name,
          text: `Check out this scheme: ${scheme.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Skill Development': 'bg-blue-100 text-blue-700',
      'Employment': 'bg-emerald-100 text-emerald-700',
      'Education': 'bg-purple-100 text-purple-700',
      'Entrepreneurship': 'bg-orange-100 text-orange-700',
      'Training': 'bg-pink-100 text-pink-700',
      'Other': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors['Other'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scheme Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The scheme you are looking for does not exist'}</p>
          <Link
            to="/schemes"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schemes
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
          to="/schemes"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Schemes
        </Link>

        {/* Scheme Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(scheme.category)}`}>
                  {scheme.category}
                </span>
                {scheme.isActive && (
                  <span className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active Scheme
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{scheme.name}</h1>
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
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Scheme</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                {scheme.description}
              </div>
            </div>

            {/* Eligibility */}
            {scheme.eligibility && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility Criteria</h2>
                <div className="space-y-4">
                  {scheme.eligibility.ageLimit && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Age Limit</p>
                        <p className="text-gray-600">
                          {scheme.eligibility.ageLimit.min} - {scheme.eligibility.ageLimit.max} years
                        </p>
                      </div>
                    </div>
                  )}
                  {scheme.eligibility.education?.length > 0 && (
                    <div className="flex items-start">
                      <FileCheck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Education Required</p>
                        <p className="text-gray-600">{scheme.eligibility.education.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {scheme.eligibility.incomeLimit && (
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Income Limit</p>
                        <p className="text-gray-600">{scheme.eligibility.incomeLimit}</p>
                      </div>
                    </div>
                  )}
                  {scheme.eligibility.otherCriteria && (
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Other Criteria</p>
                        <p className="text-gray-600">{scheme.eligibility.otherCriteria}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Benefits */}
            {scheme.benefits?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {scheme.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application Process */}
            {scheme.applicationProcess && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Apply</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                  {scheme.applicationProcess}
                </div>
              </div>
            )}

            {/* Documents Required */}
            {scheme.documentsRequired?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents Required</h2>
                <ul className="space-y-2">
                  {scheme.documentsRequired.map((doc, idx) => (
                    <li key={idx} className="flex items-center">
                      <FileCheck className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Apply for this Scheme</h3>
              
              {(scheme.startDate || scheme.endDate) && (
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-emerald-100 mr-2" />
                  <div>
                    <p className="text-sm text-emerald-100">Important Dates</p>
                    {scheme.startDate && (
                      <p className="text-sm">Start: {new Date(scheme.startDate).toLocaleDateString()}</p>
                    )}
                    {scheme.endDate && (
                      <p className="text-sm">End: {new Date(scheme.endDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              )}

              {scheme.applyLink ? (
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                >
                  Apply Online
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-emerald-100">
                    Contact the office directly to apply for this scheme.
                  </p>
                </div>
              )}
            </div>

            {/* Target Audience */}
            {scheme.targetAudience?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Audience</h3>
                <div className="flex flex-wrap gap-2">
                  {scheme.targetAudience.map((audience, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {scheme.contactInfo && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {scheme.contactInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <a href={`tel:${scheme.contactInfo.phone}`} className="text-emerald-600 hover:text-emerald-700">
                        {scheme.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {scheme.contactInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <a href={`mailto:${scheme.contactInfo.email}`} className="text-emerald-600 hover:text-emerald-700">
                        {scheme.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {scheme.contactInfo.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-3" />
                      <a 
                        href={scheme.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        Official Website
                      </a>
                    </div>
                  )}
                  {scheme.contactInfo.officeAddress && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-gray-600">{scheme.contactInfo.officeAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Posted Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-sm text-gray-500">
                Posted on {new Date(scheme.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;
