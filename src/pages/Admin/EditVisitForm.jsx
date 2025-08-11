import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
  UsersIcon,
  ArrowLeftIcon,
  SaveIcon,
  Loader2,
  BuildingIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditVisitForm = () => {
  const navigate = useNavigate();
  const { visitId } = useParams();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    companyId: '',
    visitDate: '',
    applicationDeadline: '',
    jobPositions: '',
    salaryPackage: '',
    eligibilityCriteria: '',
    batchYear: new Date().getFullYear()
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesResponse, visitResponse] = await Promise.all([
          adminAPI.getAllCompanies(),
          adminAPI.getVisitById(visitId)
        ]);

        setCompanies(companiesResponse.data);
        
        const visit = visitResponse.data;
        setFormData({
          companyId: visit.companyId,
          visitDate: visit.visitDate.split('T')[0],
          applicationDeadline: visit.applicationDeadline.split('T')[0],
          jobPositions: visit.jobPositions,
          salaryPackage: visit.salaryPackage,
          eligibilityCriteria: visit.eligibilityCriteria,
          batchYear: visit.batchYear || new Date().getFullYear()
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visitId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateVisit(visitId, {
        ...formData,
        batchYear: Number(formData.batchYear)
      });
      toast.success('Visit updated successfully');
      navigate('/admin/visits');
    } catch (error) {
      console.error('Error updating visit:', error);
      toast.error(error.response?.data?.message || 'Failed to update visit');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/visits')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Visits
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Company Visit
          </h2>
          <div className="w-24"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <select
                name="companyId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.companyId}
                onChange={handleChange}
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.companyId} value={company.companyId}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="visitDate"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.visitDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="applicationDeadline"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="batchYear"
                  min="2000"
                  max="2100"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.batchYear}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Positions *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="jobPositions"
                  required
                  placeholder="Comma separated positions (e.g., Software Engineer, Data Analyst)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.jobPositions}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Package *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSignIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="salaryPackage"
                  required
                  placeholder="e.g., 10 LPA or $100,000"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.salaryPackage}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria (CGPA) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="eligibilityCriteria"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.eligibilityCriteria}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Update Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVisitForm;