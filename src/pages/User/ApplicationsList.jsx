import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userAPI } from "../../services/api";
import {
  BriefcaseIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AcademicCapIcon,
  UserCircleIcon,
  LinkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllApplications();
      setApplications(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
      case "SELECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Selected
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateTimeString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Applications</h1>
        </div>

        {applications.length === 0 ? (
          <div className="text-center bg-white py-12 rounded-lg shadow">
            <div className="max-w-md mx-auto">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't applied to any opportunities. Start applying to see
                your applications here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.applicationId}
                className="bg-white shadow overflow-hidden rounded-lg transition-all hover:shadow-md"
              >
                {/* Application Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-start bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {application.company.name}
                    </h2>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>
                        Applied on {formatDateTime(application.applicationDate)}
                      </span>
                    </div>
                  </div>

                  <div>{getStatusBadge(application.applicationStatus)}</div>
                </div>

                {/* Application Details */}
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <BriefcaseIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">
                            Position Applied
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {application.jobPositions}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">
                            Salary Package
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {application.salaryPackage}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AcademicCapIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">
                            Eligibility Criteria
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            Minimum CGPA: {application.eligibilityCriteria}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CalendarIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">
                            Visit Date
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {formatDate(application.visitDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CalendarIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">
                            Application Deadline
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {formatDate(application.applicationDeadline)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <LinkIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-500">
                            Company Website
                          </h3>
                          <a
                            href={application.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            {application.company.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {application.feedback && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">
                        Feedback from Company
                      </h3>
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-gray-700">
                          {application.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Student Info Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-500">
                      Your Application Details
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {application.firstName} {application.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Roll Number
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {application.rollNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Department
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {application.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Student ID
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {application.studentId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;