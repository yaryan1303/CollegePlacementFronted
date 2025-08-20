import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CompanyVisitsList = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVisits();
  }, [currentPage]);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllVisits();
      setVisits(response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast.error('Failed to load company visits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (visitId) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      try {
        await adminAPI.deleteVisit(visitId);
        toast.success('Visit deleted successfully');
        fetchVisits();
      } catch (error) {
        console.error('Error deleting visit:', error);
        toast.error('Failed to delete visit');
      }
    }
  };

  if (loading && visits.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Visits</h1>
          <p className="text-gray-600 mt-1">Manage scheduled company visits</p>
        </div>
        <Link
          to="/admin/visits/new"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Schedule Visit</span>
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.map((visit) => (
                <tr key={visit.visitId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">{visit.company.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {new Date(visit.applicationDeadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="max-w-xs">
                        {visit.jobPositions.split(',').map((pos, i) => (
                          <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-1 mb-1">
                            {pos.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSignIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {visit.salaryPackage}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <Link
                      to={`/admin/visits/edit/${visit.visitId}`}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Link>
                    {/* <button
                      onClick={() => handleDelete(visit.visitId)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visits.length === 0 && !loading && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No visits scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by scheduling a company visit</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyVisitsList;