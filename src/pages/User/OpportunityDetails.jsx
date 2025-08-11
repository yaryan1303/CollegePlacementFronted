import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  CalendarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const OpportunityDetails = () => {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [eligibility, setEligibility] = useState({
    isEligible: false,
    reasons: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch opportunity details
        const opportunityResponse = await userAPI.getCompanyVisitById(visitId);
        setOpportunity(opportunityResponse.data);

        // Fetch user profile
        const profileResponse = await userAPI.getStudentDetails(user.userId);
        setUserProfile(profileResponse.data);

        // Check if user has already applied
        const applications = await userAPI.getAllApplications();
        setHasApplied(applications.data.some(app => app.visitId === parseInt(visitId)));

        // Check eligibility
        checkEligibility(opportunityResponse.data, profileResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visitId, user.userId]);

  const checkEligibility = (opportunity, profile) => {
    // console.log(opportunity, profile)
    const reasons = [];
    let isEligible = true;

    // Check batch year
    if (opportunity.batchYear !== profile.batchYear) {
      reasons.push(`Your batch year (${profile.batchYear}) doesn't match the requirement (${opportunity.batchYear})`);
    //   console.log(opportunity.batchYear, profile.batchYear)
      isEligible = false;
    }

    // Check CGPA
    const requiredCgpa = parseFloat(opportunity.eligibilityCriteria);
    if (profile.cgpa < requiredCgpa) {
        // console.log(profile.cgpa, requiredCgpa)
      reasons.push(`Your CGPA (${profile.cgpa}) is below the required minimum (${requiredCgpa})`);
      isEligible = false;
    }

    setEligibility({ isEligible, reasons });
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await userAPI.applyForOpportunity({ visitId: parseInt(visitId) });
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 'Failed to submit application';
      
      if (errorMessage.includes('not Eligible')) {
        toast.error(errorMessage, { autoClose: 5000 });
      } else if (errorMessage.includes('already applied')) {
        toast.error('You have already applied for this opportunity');
        setHasApplied(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!opportunity) return <div className="text-center py-8">Opportunity not found</div>;

  const isExpired = new Date(opportunity.applicationDeadline) < new Date();
  const positions = opportunity.jobPositions.split(',').map(pos => pos.trim());

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Opportunities
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{opportunity.company.name}</h1>
              <a 
                href={opportunity.company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {opportunity.company.website}
              </a>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {isExpired ? 'Closed' : 'Open'}
            </span>
          </div>
        </div>

        {/* Eligibility Warning */}
        {!eligibility.isEligible && !hasApplied && !isExpired && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Eligibility Issues</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {eligibility.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <CalendarIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Visit Date</h3>
                <p className="text-gray-600">
                  {new Date(opportunity.visitDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CalendarIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Application Deadline</h3>
                <p className="text-gray-600">
                  {new Date(opportunity.applicationDeadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CurrencyDollarIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Salary Package</h3>
                <p className="text-gray-600">{opportunity.salaryPackage}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Eligibility Criteria</h3>
                <p className="text-gray-600">Minimum CGPA: {opportunity.eligibilityCriteria}</p>
                <p className="text-gray-600">Batch Year: {opportunity.batchYear}</p>
              </div>
            </div>

            <div className="flex items-start">
              <BriefcaseIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Job Positions</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {positions.map((position, index) => (
                    <li key={index}>{position}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          {hasApplied ? (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span>You've already applied for this opportunity</span>
            </div>
          ) : isExpired ? (
            <div className="flex items-center text-red-600">
              <XCircleIcon className="h-5 w-5 mr-2" />
              <span>Application deadline has passed</span>
            </div>
          ) : !eligibility.isEligible ? (
            <div className="flex items-center text-red-600">
              <XCircleIcon className="h-5 w-5 mr-2" />
              <span>You are not eligible for this opportunity</span>
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                applying ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;