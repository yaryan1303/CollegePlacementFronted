import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authAPI, userAPI } from '../../services/api';

const OpportunityApplication = () => {
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');
  const [applyingStates, setApplyingStates] = useState({});
  const [errors, setErrors] = useState({});
  const [applicationStatus, setApplicationStatus] = useState({});

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const analyzeResume = async () => {
    if (!selectedFile) {
      toast.warning('Please select a resume file first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await authAPI.resumeAnalysis(selectedFile);
      setResumeAnalysis(response.data);
      toast.success('Resume analyzed successfully!');
      
      const initialStates = {};
      const initialErrors = {};
      const initialStatus = {};
      
      response.data.recommendations.forEach(opp => {
        initialStates[opp.visitId] = false;
        initialErrors[opp.visitId] = null;
        initialStatus[opp.visitId] = opp.applicationStatus || 'not_applied';
      });
      
      setApplyingStates(initialStates);
      setErrors(initialErrors);
      setApplicationStatus(initialStatus);
    } catch (error) {
      console.error('Resume analysis error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to analyze resume. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = async (visitId) => {
    if (!visitId) return;
    
    setErrors(prev => ({ ...prev, [visitId]: null }));
    setApplyingStates(prev => ({ ...prev, [visitId]: true }));
    
    try {
      await userAPI.applyForOpportunity({ visitId });
      setApplicationStatus(prev => ({ ...prev, [visitId]: 'applied' }));
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Application error:', error);
      
      let errorMessage = 'You have already applied for this company visit';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Invalid request. Please check your details.';
        } else if (error.response.status === 409) {
          errorMessage = 'You have already applied for this company visit';
          setApplicationStatus(prev => ({ ...prev, [visitId]: 'applied' }));
        } else if (error.response.status === 403) {
          errorMessage = 'You are not eligible to apply for this opportunity';
        } else if (error.response.status === 404) {
          errorMessage = 'Opportunity not found or may have been removed';
        }
      }
      
      setErrors(prev => ({ ...prev, [visitId]: errorMessage }));
    } finally {
      setApplyingStates(prev => ({ ...prev, [visitId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const renderAIFeedback = (feedback) => {
    if (!feedback) return null;
    
    // Split feedback into meaningful bullet points
    const bulletPoints = feedback.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\s*\d+\.\s*/, '')); // Remove leading numbers
    
    return (
      <ul className="list-disc pl-5 space-y-2">
        {bulletPoints.map((point, index) => (
          <li key={index} className="text-gray-700">{point}</li>
        ))}
      </ul>
    );
  };

  const currentYear = new Date().getFullYear();
  const recommendedOpportunities = resumeAnalysis?.recommendations || [];
  
  const recommended = recommendedOpportunities.filter(opp => 
    opp.batchYear === currentYear || opp.batchYear === currentYear + 1
  );
  
  const otherOpportunities = recommendedOpportunities.filter(opp => 
    opp.batchYear < currentYear || opp.batchYear > currentYear + 1
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resume Analysis & Job Opportunities</h1>

      {!resumeAnalysis && (
        <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Your Resume</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={analyzeResume}
              disabled={!selectedFile || isAnalyzing}
              className={`px-6 py-2 rounded-md text-white font-medium ${!selectedFile || isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>
        </div>
      )}

      {resumeAnalysis && (
        <>
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Your Profile Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name: <span className="font-normal">{resumeAnalysis.profile.name}</span></p>
                <p className="font-medium">Email: <span className="font-normal">{resumeAnalysis.profile.email}</span></p>
                <p className="font-medium">Phone: <span className="font-normal">{resumeAnalysis.profile.phone}</span></p>
              </div>
              <div>
                <p className="font-medium">Top Skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {resumeAnalysis.profile.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-800 mb-3">AI Resume Feedback</h2>
            {renderAIFeedback(resumeAnalysis.aiFeedback)}
          </div>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('recommended')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'recommended' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Recommended Opportunities
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {recommended.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'other' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Other Opportunities
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {otherOpportunities.length}
                </span>
              </button>
            </nav>
          </div>

          <div className="space-y-6">
            {(activeTab === 'recommended' ? recommended : otherOpportunities).map((opportunity) => {
              const isApplying = applyingStates[opportunity.visitId] || false;
              const error = errors[opportunity.visitId];
              const isApplied = applicationStatus[opportunity.visitId] === 'applied';
              const deadlinePassed = isDeadlinePassed(opportunity.applicationDeadline);

              return (
                <div key={opportunity.visitId} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{opportunity.companyName}</h3>
                      <p className="text-gray-600">{opportunity.jobPositions}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {opportunity.salaryPackage}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Visit Date</p>
                      <p>{formatDate(opportunity.visitDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className={deadlinePassed ? 'text-red-500' : ''}>
                        {formatDate(opportunity.applicationDeadline)}
                        {deadlinePassed && ' (Passed)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Eligibility Criteria</p>
                      <p>CGPA: {opportunity.eligibilityCriteria}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Match Score</p>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${opportunity.score * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {(opportunity.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm text-gray-700">Match Reason:</p>
                    <p className="text-sm text-gray-600">{opportunity.reason}</p>
                  </div>

                  {error && (
                    <div className="mt-3 p-2 bg-red-50 text-red-600 text-sm rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleApply(opportunity.visitId)}
                      disabled={isApplied || deadlinePassed || isApplying}
                      className={`px-6 py-2 rounded-md text-white font-medium ${
                        isApplied
                          ? 'bg-green-500 cursor-default'
                          : deadlinePassed
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isApplied
                        ? 'Applied ✓'
                        : deadlinePassed
                          ? 'Deadline Passed'
                          : isApplying
                            ? 'Applying...'
                            : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}

            {activeTab === 'recommended' && recommended.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No recommended opportunities found based on your resume.</p>
              </div>
            )}

            {activeTab === 'other' && otherOpportunities.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No other opportunities available at this time.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OpportunityApplication;