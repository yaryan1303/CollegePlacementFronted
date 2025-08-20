import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  BriefcaseIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await adminAPI.deleteCompany(id);
        fetchCompanies();
      } catch (error) {
        const errorMessage =
          error.message || // This is where your error is (Username already taken)
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again.";
        setError(errorMessage);
        console.error("Error deleting company:", error);
      }
    }
  };

  if (loading && companies.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Companies Management
          </h1>
          <p className="text-gray-600 mt-1">Manage all recruiting companies</p>
        </div>
        <Link
          to="/companies/new"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Company</span>
        </Link>
      </div>
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* Companies Grid */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.companyId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <BriefcaseIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {company.name}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/companies/edit/${company.companyId}`}
                      className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                      title="Edit"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(company.companyId)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {company.description && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {company.description}
                  </p>
                )}

                <div className="mt-4 space-y-2">
                  {company.website && (
                    <div className="flex items-center text-sm text-blue-600">
                      <GlobeIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}

                  {company.contactEmail && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MailIcon className="h-4 w-4 mr-2 text-gray-500" />
                      {company.contactEmail}
                    </div>
                  )}

                  {company.contactPhone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />
                      {company.contactPhone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No companies found
          </h3>
          <p className="mt-1 text-gray-500">
            Get started by adding your first company
          </p>
          <Link
            to="/companies/new"
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Company
          </Link>
        </div>
      )}
    </div>
  );
};

export default Companies;
