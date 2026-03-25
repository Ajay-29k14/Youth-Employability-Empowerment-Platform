/**
 * Resources Page
 * Display career preparation resources with categories
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourcesAPI } from '../services/api';
import { 
  BookOpen, 
  Search,
  Clock,
  Eye,
  ArrowRight,
  Filter,
  X,
  TrendingUp,
  Lightbulb,
  FileText,
  HelpCircle,
  GraduationCap,
  Star
} from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [popularResources, setPopularResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficultyLevel: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = [
    'Interview Tips',
    'Resume Tips',
    'Practice Questions',
    'Career Guidance',
    'Skill Building',
    'Other'
  ];

  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all resources
        const resourcesResponse = await resourcesAPI.getResources({ limit: 12 });
        setResources(resourcesResponse.data.data.resources);

        // Fetch popular resources
        const popularResponse = await resourcesAPI.getPopularResources(4);
        setPopularResources(popularResponse.data.data.resources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await resourcesAPI.getResources(filters);
      setResources(response.data.data.resources);
    } catch (error) {
      console.error('Error searching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      search: '',
      category: '',
      difficultyLevel: ''
    });
    try {
      setLoading(true);
      const response = await resourcesAPI.getResources();
      setResources(response.data.data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Career Resources</h1>
          <p className="text-gray-600 mt-1">
            Access interview tips, resume guides, and skill development resources
          </p>
        </div>

        {/* Popular Resources */}
        {!loading && popularResources.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Popular Resources</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularResources.map((resource) => {
                const Icon = getCategoryIcon(resource.category);
                return (
                  <Link
                    key={resource._id}
                    to={`/resources/${resource._id}`}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(resource.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{resource.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Eye className="h-3 w-3 mr-1" />
                          {resource.viewCount} views
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

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
                placeholder="Search resources..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                  <select
                    name="difficultyLevel"
                    value={filters.difficultyLevel}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {difficultyOptions.map((option) => (
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

        {/* Category Quick Links */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <button
                  key={category}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category }));
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className={`flex items-center px-4 py-2 rounded-full border transition-colors ${
                    filters.category === category
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const Icon = getCategoryIcon(resource.category);
              return (
                <Link
                  key={resource._id}
                  to={`/resources/${resource._id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                      </span>
                      {resource.difficultyLevel && (
                        <span className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 mr-1" />
                          {resource.difficultyLevel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start space-x-3 mb-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(resource.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{resource.title}</h3>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {resource.readTime} min read
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {resource.viewCount}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-emerald-600 font-medium text-sm">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
