import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { 
  BriefcaseIcon, 
  ClipboardListIcon, 
  TrophyIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [activeVisits, setActiveVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [applicationsRes, visitsRes] = await Promise.all([
        userAPI.getAllApplications(),
        userAPI.getActiveVisits()
      ]);
      
      setApplications(applicationsRes.data);
      setActiveVisits(visitsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      SELECTED: 'bg-emerald-100 text-emerald-800',
      REJECTED: 'bg-rose-100 text-rose-800',
      PENDING: 'bg-amber-100 text-amber-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const quickStats = [
    {
      title: 'Total Applications',
      value: applications.length,
      icon: ClipboardListIcon,
      color: 'bg-blue-500',
      link: '/applications'
    },
    {
      title: 'Selected',
      value: applications.filter(app => app.applicationStatus === 'SELECTED').length,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
      link: '/applications'
    },
    {
      title: 'Pending',
      value: applications.filter(app => app.applicationStatus === 'PENDING').length,
      icon: CalendarIcon,
      color: 'bg-amber-500',
      link: '/applications'
    },
    {
      title: 'Active Opportunities',
      value: activeVisits.length,
      icon: BriefcaseIcon,
      color: 'bg-indigo-500',
      link: '/opportunities'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your placement overview</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchDashboardData}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <ArrowRightIcon className="h-5 w-5 mr-2 rotate-90" />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Link 
              key={index} 
              to={stat.link} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg shadow-inner`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <ClipboardListIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Recent Applications
                </h2>
                <Link 
                  to="/applications" 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  View all <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {applications.slice(0, 5).map((application) => (
                <div key={application.applicationId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {application.company.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {application.jobPositions}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {getStatusBadge(application.applicationStatus)}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(application.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {applications.length === 0 && (
                <div className="p-8 text-center">
                  <ClipboardListIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Start applying to companies to see your applications here</p>
                  <div className="mt-6">
                    <Link
                      to="/opportunities"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Browse Opportunities
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Opportunities Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  Active Opportunities
                </h2>
                <Link 
                  to="/opportunities" 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  View all <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {activeVisits.slice(0, 5).map((visit) => (
                <Link 
                  key={visit.visitId} 
                  to={`/opportunities/${visit.visitId}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Building className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {visit.company.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {visit.jobPositions}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Package:</span> {visit.salaryPackage}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 text-right">
                      <p className="text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 inline mr-1" />
                        {new Date(visit.visitDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Deadline: {new Date(visit.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              
              {activeVisits.length === 0 && (
                <div className="p-8 text-center">
                  <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active opportunities</h3>
                  <p className="mt-1 text-sm text-gray-500">Check back later for new placement opportunities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;