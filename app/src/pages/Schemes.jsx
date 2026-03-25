/**
 * Schemes Page
 * Display government schemes with filters and search
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schemesAPI } from '../services/api';
import { 
  FileText, 
  Search, 
  Filter,
  Users,
  Calendar,
  ArrowRight,
  X,
  CheckCircle,
  Target
} from 'lucide-react';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    targetAudience: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0
  });

  const categoryOptions = [
    'Skill Development',
    'Employment',
    'Education',
    'Entrepreneurship',
    'Training',
    'Other'
  ];

  const targetAudienceOptions = [
    'Students',
    'Unemployed Youth',
    'Women',
    'Farmers',
    'Entrepreneurs',
    'All'
  ];

  const fetchSchemes = async (page = 1) => {
    try {
      setLoading(true);
      const response = await schemesAPI.getSchemes({
        ...filters,
        page,
        limit: 10
      });
      setSchemes(response.data.data.schemes);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSchemes(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      targetAudience: ''
    });
    fetchSchemes(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchJobs(newPage);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Government Schemes</h1>
          <p className="text-gray-600 mt-1">
            Explore government programs and schemes designed to support your career and education
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search schemes by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </form>

          {showFilters && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <select
                    name="targetAudience"
                    value={filters.targetAudience}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Audiences</option>
                    {targetAudienceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {schemes.length} of {pagination.total} schemes
          </p>
        </div>

        {/* Schemes List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : schemes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(scheme.category)}`}>
                    {scheme.category}
                  </span>
                  {scheme.isActive && (
                    <span className="flex items-center text-xs text-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {scheme.description}
                </p>

                {/* Benefits */}
                {scheme.benefits?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Benefits:</p>
                    <ul className="space-y-1">
                      {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Audience */}
                {scheme.targetAudience?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scheme.targetAudience.map((audience, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                )}

                {/* Important Dates */}
                {(scheme.startDate || scheme.endDate) && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {scheme.startDate && (
                      <span>From {new Date(scheme.startDate).toLocaleDateString()}</span>
                    )}
                    {scheme.endDate && (
                      <span className="ml-2">Till {new Date(scheme.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                )}

                <Link
                  to={`/schemes/${scheme._id}`}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;
