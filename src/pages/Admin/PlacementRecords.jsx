import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Card, Space, Typography, Spin, Tabs, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { adminAPI, userAPI } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

const PlacementRecords = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchedRecords, setSearchedRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchName, setSearchName] = useState('');
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
      const response = await adminAPI.getAllPlacementRecordsAdmin();
      setAllRecords(response.data);
    } catch (error) {
      console.error('Error fetching all records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredRecords = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPlacementRecordsAdmin(
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

  const searchByName = async () => {
    if (!searchName.trim()) {
      setSearchedRecords([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await adminAPI.searchPlacementRecordsByName(searchName);
      setSearchedRecords(response.data);
    } catch (error) {
      console.error('Error searching by name:', error);
      setSearchedRecords([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCompanyChange = (value) => {
    setFilters({ ...filters, companyName: value });
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, batchYear: value ? parseInt(value) : undefined });
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Clear search results when switching away from search tab
    if (key !== 'search') {
      setSearchName('');
      setSearchedRecords([]);
    }
  };

  const handleSearchSubmit = () => {
    searchByName();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchByName();
    }
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
          {/* All Placements Tab */}
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
          
          {/* Filter Placements Tab */}
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

          {/* Search by Name Tab */}
          <TabPane tab="Search by Name" key="search">
            <Space size="large" style={{ marginBottom: '24px', width: '100%' }}>
              <Search
                placeholder="Enter student name to search"
                enterButton={<SearchOutlined />}
                size="large"
                value={searchName}
                onChange={handleSearchChange}
                onSearch={handleSearchSubmit}
                onKeyPress={handleKeyPress}
                style={{ width: 400 }}
                loading={searchLoading}
              />
              <Button 
                onClick={() => {
                  setSearchName('');
                  setSearchedRecords([]);
                }}
                disabled={!searchName && searchedRecords.length === 0}
              >
                Clear
              </Button>
            </Space>

            {searchName && searchedRecords.length === 0 && !searchLoading && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                No placement records found for "{searchName}"
              </div>
            )}

            <Spin spinning={searchLoading}>
              <Table
                columns={columns}
                dataSource={searchedRecords}
                rowKey="recordId"
                bordered
                size="middle"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                locale={{
                  emptyText: searchName ? 
                    `No results found for "${searchName}"` : 
                    'Enter a student name to search'
                }}
              />
            </Spin>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default PlacementRecords;