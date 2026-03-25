/**
 * Home Page
 * Landing page for the Digital Employability Platform
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  BookOpen, 
  Users, 
  ArrowRight,
  CheckCircle,
  MapPin,
  GraduationCap
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Briefcase,
      title: 'Job Opportunities',
      description: 'Find local job openings matching your skills and location. Get personalized recommendations.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FileText,
      title: 'Government Schemes',
      description: 'Discover government programs and schemes designed to support rural youth employment.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: BookOpen,
      title: 'Career Resources',
      description: 'Access interview tips, resume guides, and skill development resources.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      title: 'Skill Development',
      description: 'Learn new skills and improve your employability with our training resources.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Your Profile',
      description: 'Register and build your digital profile with your skills and interests.'
    },
    {
      number: '2',
      title: 'Explore Opportunities',
      description: 'Browse jobs, schemes, and resources tailored for you.'
    },
    {
      number: '3',
      title: 'Apply & Grow',
      description: 'Apply for jobs, enroll in programs, and build your career.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Empowering Rural Youth for a Brighter Future
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 mb-8">
                Discover job opportunities, government schemes, and skill development 
                resources designed to help you build a successful career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
                >
                  Already have an account? Login
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Briefcase className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-emerald-100">Job Opportunities</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">50+</p>
                    <p className="text-sm text-emerald-100">Government Schemes</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">10,000+</p>
                    <p className="text-sm text-emerald-100">Registered Users</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">100+</p>
                    <p className="text-sm text-emerald-100">Districts Covered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive support for your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Digital Employability Platform?
              </h2>
              <div className="space-y-4">
                {[
                  'Free access to job opportunities in your area',
                  'Information about government schemes and benefits',
                  'Career guidance and skill development resources',
                  'Mobile-friendly platform for easy access',
                  'Personalized job recommendations',
                  'Regular notifications about new opportunities'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <GraduationCap className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Success Stories
                  </h3>
                  <p className="text-gray-600">Real people, real results</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 italic">
                    "This platform helped me find a job in my district. 
                    I am now working as a data entry operator."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- Ramesh, Uttar Pradesh</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 italic">
                    "I learned about a government skill development program 
                    through this platform. It changed my life!"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- Priya, Bihar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of rural youth who are building their careers 
            with our platform
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
