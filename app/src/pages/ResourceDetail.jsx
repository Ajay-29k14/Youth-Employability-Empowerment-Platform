/**
 * Resource Detail Page
 * Display detailed content of a career resource
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourcesAPI } from '../services/api';
import { 
  BookOpen, 
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Download,
  Star,
  CheckCircle,
  Lightbulb,
  FileText,
  HelpCircle,
  GraduationCap,
  User
} from 'lucide-react';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await resourcesAPI.getResourceById(id);
        setResource(response.data.data.resource);
      } catch (error) {
        console.error('Error fetching resource:', error);
        setError('Resource not found or has been removed');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: `Check out this resource: ${resource.title}`,
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Interview Tips': HelpCircle,
      'Resume Tips': FileText,
      'Practice Questions': HelpCircle,
      'Career Guidance': Lightbulb,
      'Skill Building': GraduationCap,
      'Other': BookOpen
    };
    return icons[category] || BookOpen;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Interview Tips': 'bg-blue-100 text-blue-700',
      'Resume Tips': 'bg-emerald-100 text-emerald-700',
      'Practice Questions': 'bg-purple-100 text-purple-700',
      'Career Guidance': 'bg-orange-100 text-orange-700',
      'Skill Building': 'bg-pink-100 text-pink-700',
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

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The resource you are looking for does not exist'}</p>
          <Link
            to="/resources"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const Icon = getCategoryIcon(resource.category);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/resources"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>

        {/* Resource Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.category)}`}>
              {resource.category}
            </span>
            {resource.difficultyLevel && (
              <span className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 mr-1" />
                {resource.difficultyLevel}
              </span>
            )}
          </div>

          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${getCategoryColor(resource.category)}`}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{resource.title}</h1>
              <p className="text-gray-600 mt-2">{resource.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {resource.readTime} min read
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {resource.viewCount} views
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Posted {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            {resource.attachments?.length > 0 && (
              <button
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="prose max-w-none text-gray-700">
            {/* Render content with proper formatting */}
            {resource.content.split('\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={idx} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{paragraph.slice(2)}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.slice(3)}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-3">{paragraph.slice(4)}</h3>;
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={idx} className="flex items-start ml-4 mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{paragraph.slice(2)}</span>
                  </li>
                );
              }
              if (paragraph.trim() === '') {
                return <div key={idx} className="h-4"></div>;
              }
              return <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>;
            })}
          </div>
        </div>

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {resource.attachments?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
            <div className="space-y-3">
              {resource.attachments.map((attachment, idx) => (
                <a
                  key={idx}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  <div className="bg-emerald-100 p-2 rounded-lg mr-4">
                    <Download className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{attachment.name}</p>
                    <p className="text-sm text-gray-500 uppercase">{attachment.type}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related Resources CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Want to learn more?</h3>
          <p className="text-emerald-100 mb-4">
            Explore more resources to help you prepare for your career
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Browse All Resources
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
