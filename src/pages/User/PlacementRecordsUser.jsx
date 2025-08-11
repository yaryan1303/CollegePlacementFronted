import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Card, Space, Typography, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { userAPI } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;

const PlacementRecordsUser = () => {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    companyName: undefined,
    batchYear: undefined
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllCompanies();
      setCompanies(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPlacementRecordsUser(filters.batchYear, filters.companyName);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
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

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
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
      render: (positions) => positions.split(',').map(pos => (
        <div key={pos} style={{ margin: '2px 0' }}>{pos.trim()}</div>
      )),
    },
    {
      title: 'Package (LPA)',
      dataIndex: 'salaryPackage',
      key: 'salaryPackage',
      sorter: (a, b) => parseFloat(a.salaryPackage) - parseFloat(b.salaryPackage),
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
          
          <Input
            placeholder="Filter by batch year"
            prefix={<SearchOutlined />}
            onChange={handleYearChange}
            style={{ width: '200px' }}
            type="number"
            allowClear
          />
        </Space>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={records}
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
      </Card>
    </div>
  );
};

export default PlacementRecordsUser;