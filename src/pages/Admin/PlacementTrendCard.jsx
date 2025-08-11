import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { adminAPI } from '../../services/api';

const PlacementTrendCard = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminAPI.getYearWisePlacementCount();
        console.log(response.data);
        const apiData = response.data;
        
        // Transform the API data into the format expected by the chart
        const formattedData = Object.entries(apiData)
          .map(([year, placements]) => ({
            year: year.toString(),
            placements
          }))
          .sort((a, b) => a.year.localeCompare(b.year)); // Sort by year
        
        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate percentage change from last year
  const getPercentageChange = () => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1].placements;
    const previous = chartData[chartData.length - 2].placements;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-64">
          <p>Loading placement data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-64">
          <p>No placement data available</p>
        </div>
      </div>
    );
  }

  const percentageChange = getPercentageChange();
  const isPositive = percentageChange >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Placement Trends</h2>
          <p className="text-gray-600">Year-wise placement performance</p>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
            {percentageChange}% {isPositive ? 'increase' : 'decrease'} from last year
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="placements" 
              name="Placements" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === chartData.length - 1 ? '#4F46E5' : '#A5B4FC'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-sm font-medium text-gray-900">{item.placements}</p>
            <p className="text-xs text-gray-500">{item.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementTrendCard;