import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  DollarSignIcon,
  BuildingIcon,
  ClockIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  AwardIcon,
  UsersIcon,
  FunnelIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getActiveVisits();
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = searchQuery === '' || 
      opp.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.jobPositions.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBatch = batchFilter === '' || 
      opp.batchYear.toString() === batchFilter;
    
    return matchesSearch && matchesBatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
            <p className="text-gray-600 mt-1">
              {filteredOpportunities.length} active opportunity{filteredOpportunities.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchOpportunities}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <ArrowRightIcon className="h-5 w-5 mr-2 rotate-90" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company or position..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Batches</option>
                {Array.from(new Set(opportunities.map(o => o.batchYear))).sort().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        {filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {opportunities.length === 0 ? 'No opportunities available' : 'No matching opportunities found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {opportunities.length === 0 
                ? 'Check back later for new job postings.' 
                : 'Try adjusting your search filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOpportunities.map((opportunity) => {
              const daysLeft = getDaysUntilDeadline(opportunity.applicationDeadline);
              const isExpired = isDeadlinePassed(opportunity.applicationDeadline);
              
              return (
                <div 
                  key={opportunity.visitId} 
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden ${
                    isExpired ? 'opacity-70' : ''
                  }`}
                >
                  <div className="p-6">
                    {/* Company Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <BuildingIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {opportunity.company.name}
                          </h3>
                          {opportunity.company.website && (
                            <a 
                              href={opportunity.company.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                            >
                              <span>Visit Website</span>
                              <ExternalLinkIcon className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        isExpired 
                          ? 'bg-gray-100 text-gray-800' 
                          : daysLeft <= 3 
                            ? 'bg-red-100 text-red-800' 
                            : daysLeft <= 7 
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isExpired ? 'Closed' : daysLeft > 0 ? `${daysLeft} days left` : 'Last day!'}
                      </div>
                    </div>

                    {/* Opportunity Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start space-x-3">
                        <BriefcaseIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Positions</h4>
                          <p className="text-sm text-gray-900">
                            {opportunity.jobPositions.split(',').map((pos, i) => (
                              <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700 mr-1 mb-1">
                                {pos.trim()}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <DollarSignIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Package</h4>
                          <p className="text-sm text-gray-900">{opportunity.salaryPackage}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Visit Date</h4>
                          <p className="text-sm text-gray-900">
                            {new Date(opportunity.visitDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Application Deadline</h4>
                          <p className="text-sm text-gray-900">
                            {new Date(opportunity.applicationDeadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex items-start space-x-3">
                        <AwardIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Eligibility Criteria</h4>
                          <p className="text-sm text-gray-900">{opportunity.eligibilityCriteria}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-2">
                        <UsersIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Eligible Batch</h4>
                          <p className="text-sm text-gray-900">{opportunity.batchYear}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                      <Link
                        to={`/opportunities/${opportunity.visitId}`}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          isExpired 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                        onClick={isExpired ? (e) => e.preventDefault() : undefined}
                      >
                        {isExpired ? 'Application Closed' : 'View Details & Apply'}
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;