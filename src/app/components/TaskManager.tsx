import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import { SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

interface TaskType {
  id: string;
  name: string;
  content: string;
  description: string;
}

// Mock data
const initialTasks: TaskType[] = [
  {
    id: '1',
    name: 'Kiểm tra tồn kho',
    content: 'Check số lượng e-voucher trên hệ thống kho',
    description: 'Thao tác gọi API /inventory/check hoặc xem trên dashboard kho.'
  },
  {
    id: '2',
    name: 'Gửi Email báo giá',
    content: 'Gửi email báo giá cho khách hàng doanh nghiệp',
    description: 'Nhấn nút "Gửi Email", chọn template Báo Giá B2B, đính kèm file PDF.'
  },
  {
    id: '3',
    name: 'Hủy giao dịch',
    content: 'Hủy đơn hàng nếu khách hàng yêu cầu refund',
    description: 'Vào chi tiết đơn hàng -> Actions -> Hủy giao dịch -> Nhập lý do -> Xác nhận.'
  }
];

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);
  const searchInput = React.useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: () => void) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: keyof TaskType) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}...`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, background: '#2db7f5', borderColor: '#2db7f5' }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#2db7f5' : undefined }} />
    ),
    onFilter: (value: any, record: TaskType) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const columns = [
    {
      title: 'Tên tác vụ',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      ...getColumnSearchProps('name'),
      render: (text: string) => <span className="font-semibold text-slate-900">{text}</span>
    },
    {
      title: 'Nội dung tác vụ',
      dataIndex: 'content',
      key: 'content',
      width: 350,
      ...getColumnSearchProps('content'),
    },
    {
      title: 'Mô tả thao tác',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: () => (
        <Button
          type="link"
          icon={<EditOutlined />}
          style={{ color: '#2db7f5' }}
          onClick={() => alert('Tính năng sửa tác vụ đang phát triển')}
        />
      )
    }
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 bg-white shrink-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold m-0" style={{ color: '#001529' }}>
            Quản lý tác vụ
          </h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            style={{ background: '#2db7f5', borderColor: '#2db7f5' }}
            onClick={() => alert('Tính năng thêm tác vụ đang phát triển')}
          >
            Thêm tác vụ
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#eff0f9' }}>
        <div className="bg-white rounded shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
          />
        </div>
      </div>
    </div>
  );
};
