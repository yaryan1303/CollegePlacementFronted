import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  PieChart,
  BarChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  UserIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

const ReportsDashboard = () => {
  const [placementSummary, setPlacementSummary] = useState(null);
  const [companyStats, setCompanyStats] = useState([]);
  const [branchYearStats, setBranchYearStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryResponse, statsResponse, branchYearResponse] = await Promise.all([
          adminAPI.getPlacementSummary(),
          adminAPI.getCompanyStats(),
          adminAPI.getBranchYearWisePlacements()
        ]);
        setPlacementSummary(summaryResponse.data);
        setCompanyStats(statsResponse.data);
        setBranchYearStats(branchYearResponse.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportCompanyStats();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'placement_stats.xlsx');
      toast.success('Export started successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export placement stats');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Process branch-year data for visualization
  const getBranchData = () => {
    if (!branchYearStats) return [];
    
    return Object.entries(branchYearStats).map(([branch, years]) => {
      const placements = Object.values(years).flat().length;
      return { name: branch, value: placements };
    });
  };

  const getYearData = () => {
    if (!branchYearStats) return [];
    
    const yearMap = {};
    
    Object.values(branchYearStats).forEach(years => {
      Object.entries(years).forEach(([year, placements]) => {
        if (!yearMap[year]) {
          yearMap[year] = 0;
        }
        yearMap[year] += placements.length;
      });
    });
    
    return Object.entries(yearMap).map(([year, count]) => ({
      year,
      placements: count
    })).sort((a, b) => a.year - b.year);
  };

  const getBranchYearTableData = () => {
    if (!branchYearStats) return [];
    
    const branches = Object.keys(branchYearStats);
    const years = [...new Set(
      Object.values(branchYearStats)
        .flatMap(years => Object.keys(years))
    )].sort();
    
    return branches.map(branch => {
      const row = { branch };
      years.forEach(year => {
        row[year] = branchYearStats[branch]?.[year]?.length || 0;
      });
      return row;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Placement Reports Dashboard</h1>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Data
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'companies' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Company Statistics
              </button>
              <button
                onClick={() => setActiveTab('branch-year')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'branch-year' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Branch & Year Stats
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-2xl font-semibold text-gray-900">{placementSummary.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Placed Students</p>
                    <p className="text-2xl font-semibold text-gray-900">{placementSummary.placedStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <ArrowTrendingUpIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Placement Percentage</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {placementSummary.placementPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placement Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Placement Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Placed', value: placementSummary.placedStudents },
                          { name: 'Unplaced', value: placementSummary.totalStudents - placementSummary.placedStudents }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Batch-wise Placement Stats</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={placementSummary.batchWiseStats}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="batchYear" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="placedStudents" name="Placed Students" fill="#8884d8" />
                      <Bar dataKey="totalStudents" name="Total Students" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Company-wise Statistics</h2>
              <div className="h-96 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={companyStats.filter(c => c.totalVisits > 0)}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 100,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="companyName" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalVisits" name="Total Visits" fill="#8884d8" />
                    <Bar dataKey="totalApplications" name="Applications" fill="#82ca9d" />
                    <Bar dataKey="totalPlacements" name="Placements" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placements</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companyStats.map((company, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="font-medium">{company.companyName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{company.totalVisits}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{company.totalApplications}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{company.totalPlacements}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {company.totalApplications > 0 
                            ? `${((company.totalPlacements / company.totalApplications) * 100).toFixed(2)}%` 
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'branch-year' && branchYearStats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Branch-wise Placements */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <AcademicCapIcon className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Branch-wise Placements</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getBranchData()}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Placements" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Year-wise Placements */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <CalendarIcon className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Year-wise Placements</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getYearData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="placements" name="Placements" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Detailed Branch-Year Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <BuildingOffice2Icon className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Detailed Branch & Year Statistics</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                        {Object.keys(branchYearStats[Object.keys(branchYearStats)[0]] || {}).sort().map(year => (
                          <th key={year} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {year}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(branchYearStats).map(([branch, years]) => {
                        const total = Object.values(years).flat().length;
                        return (
                          <tr key={branch} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              <div className="flex items-center">
                                <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                                {branch}
                              </div>
                            </td>
                            {Object.keys(years).sort().map(year => (
                              <td key={year} className="px-6 py-4 whitespace-nowrap">
                                {years[year].length}
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap font-semibold">{total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Branch-wise Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Branch-wise Placement Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getBranchData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getBranchData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;