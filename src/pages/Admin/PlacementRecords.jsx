import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  UserIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const PlacementRecords = () => {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchYear, setBatchYear] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [internshipFilter, setInternshipFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'placementDate', direction: 'desc' });
  const [viewMode, setViewMode] = useState('filtered'); // 'filtered' or 'all'

  useEffect(() => {
    fetchCompanies();
    if (viewMode === 'all') {
      fetchAllRecords();
    } else {
      fetchFilteredRecords();
    }
  }, [batchYear, companyFilter, viewMode]);

  const fetchFilteredRecords = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPlacementRecords(batchYear || null, companyFilter || null);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching filtered records:', error);
      toast.error('Failed to load placement records');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecords = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllPlacements();
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching all records:', error);
      toast.error('Failed to load all placement records');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await adminAPI.getAllCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    }
  };

  const handleExport = async () => {
    try {
      const response = viewMode === 'all' 
        ? await adminAPI.exportAllPlacements() 
        : await adminAPI.exportPlacementRecords(batchYear, companyFilter);
      
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `placement_records_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Export started successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export placement records');
    }
  };

  const handleRefresh = () => {
    if (viewMode === 'all') {
      fetchAllRecords();
    } else {
      fetchFilteredRecords();
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRecords = [...records].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredRecords = sortedRecords.filter(record => {
    const matchesSearch = searchQuery === '' || 
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.companyName && record.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      record.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInternship = internshipFilter === 'all' || 
      (internshipFilter === 'internship' && record.internship) ||
      (internshipFilter === 'fulltime' && !record.internship);

    return matchesSearch && matchesInternship;
  });

  const SortIndicator = ({ columnKey }) => (
    <span className="ml-1">
      {sortConfig.key === columnKey ? (
        sortConfig.direction === 'asc' ? '↑' : '↓'
      ) : null}
    </span>
  );

  if (loading && records.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Placement Records</h1>
            <p className="text-gray-600 mt-1">
              {viewMode === 'all' ? 'All placement records' : 'Filtered placement records'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <button
                onClick={() => setViewMode('filtered')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'filtered' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Filtered View
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              >
                All Records
              </button>
            </div>
          </div>

          {viewMode === 'filtered' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
                <select
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Years</option>
                  {[2023, 2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Companies</option>
                  {companies.map(company => (
                    <option key={company.companyId} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select
                  value={internshipFilter}
                  onChange={(e) => setInternshipFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="internship">Internship</option>
                  <option value="fulltime">Full-time</option>
                </select>
              </div>
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
                    placeholder="Search records..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('studentName')}
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      Student
                      <SortIndicator columnKey="studentName" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('companyName')}
                  >
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      Company
                      <SortIndicator columnKey="companyName" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('salaryPackage')}
                  >
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      Package
                      <SortIndicator columnKey="salaryPackage" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('placementDate')}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Date
                      <SortIndicator columnKey="placementDate" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.recordId || record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{record.studentName}</div>
                            <div className="text-sm text-gray-500">ID: {record.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{record.companyName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {record.position.split(',').map((pos, i) => (
                          <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700 mr-1 mb-1">
                            {pos.trim()}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {record.salaryPackage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(record.placementDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.internship ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Internship
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Full-time
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="text-center py-12">
                        <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No placement records found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementRecords;