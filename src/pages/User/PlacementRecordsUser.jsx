import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Card, Space, Typography, Spin, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { userAPI } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const PlacementRecordsUser = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    companyName: undefined,
    batchYear: undefined
  });

  useEffect(() => {
    fetchCompanies();
    fetchAllRecords();
  }, []);

  useEffect(() => {
    if (activeTab === 'filtered') {
      fetchFilteredRecords();
    }
  }, [filters, activeTab]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecords = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllPlacementRecordsUser();
      setAllRecords(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching all records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredRecords = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPlacementRecordsUser(
        filters.batchYear, 
        filters.companyName
      );
      setFilteredRecords(response.data);
    } catch (error) {
      console.error('Error fetching filtered records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (value) => {
    setFilters({ ...filters, companyName: value });
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, batchYear: value ? parseInt(value) : undefined });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Package (LPA)',
      dataIndex: 'salaryPackage',
      key: 'salaryPackage',
      sorter: (a, b) => {
        const aValue = parseFloat(a.salaryPackage);
        const bValue = parseFloat(b.salaryPackage);
        return aValue - bValue;
      },
    },
    {
      title: 'Placement Date',
      dataIndex: 'placementDate',
      key: 'placementDate',
      sorter: (a, b) => new Date(a.placementDate) - new Date(b.placementDate),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Internship',
      dataIndex: 'internship',
      key: 'internship',
      render: (internship) => internship ? 'Yes' : 'No',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3} style={{ marginBottom: '24px' }}>Placement Records</Title>
        
        <Tabs defaultActiveKey="all" onChange={handleTabChange}>
          <TabPane tab="All Placements" key="all">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={allRecords}
                rowKey="recordId"
                bordered
                size="middle"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
              />
            </Spin>
          </TabPane>
          
          <TabPane tab="Filter Placements" key="filtered">
            <Space size="large" style={{ marginBottom: '24px', width: '100%' }}>
              <div style={{ width: '300px' }}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select a company"
                  optionFilterProp="children"
                  onChange={handleCompanyChange}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                >
                  {companies.map(company => (
                    <Option key={company.companyId} value={company.name}>
                      {company.name}
                    </Option>
                  ))}
                </Select>
              </div>
              
             
            </Space>

            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={filteredRecords}
                rowKey="recordId"
                bordered
                size="middle"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
              />
            </Spin>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default PlacementRecordsUser;