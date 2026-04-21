import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, message, Tag, Switch } from 'antd';
import { SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

const { TextArea } = Input;

interface TaskType {
  id: string;
  name: string;
  content: string;
  description: string;
  prompt: string;
  isActive: boolean;
}

// Mock data
const initialTasks: TaskType[] = [
  {
    id: '1',
    name: 'Kiểm tra tồn kho',
    content: 'Check số lượng e-voucher trên hệ thống kho',
    description: 'Thao tác gọi API /inventory/check hoặc xem trên dashboard kho.',
    prompt: 'Bạn là trợ lý ảo hỗ trợ kiểm tra tồn kho. Khi nhận yêu cầu kiểm tra số lượng voucher, hãy hỏi rõ Tên Chương trình và Mã doanh nghiệp.',
    isActive: true
  },
  {
    id: '2',
    name: 'Gửi Email báo giá',
    content: 'Gửi email báo giá cho khách hàng doanh nghiệp',
    description: 'Nhấn nút "Gửi Email", chọn template Báo Giá B2B, đính kèm file PDF.',
    prompt: 'Hãy tạo mẫu email báo giá chuyên nghiệp B2B. Yêu cầu có đầy đủ thông tin: Lời chào, Bảng giá đính kèm, Chính sách chiết khấu, và Thông tin liên hệ.',
    isActive: true
  },
  {
    id: '3',
    name: 'Hủy giao dịch',
    content: 'Hủy đơn hàng nếu khách hàng yêu cầu refund',
    description: 'Vào chi tiết đơn hàng -> Actions -> Hủy giao dịch -> Nhập lý do -> Xác nhận.',
    prompt: 'Trước khi hủy giao dịch, hãy yêu cầu người dùng xác nhận lý do hủy và đảm bảo trạng thái đơn hàng là chưa sử dụng.',
    isActive: false
  }
];

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);
  const searchInput = React.useRef<InputRef>(null);

  // States for Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [form] = Form.useForm();

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

  const handleAddClick = () => {
    setEditingTask(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true }); // Default to active when adding
    setIsModalOpen(true);
  };

  const handleEditClick = (record: TaskType) => {
    setEditingTask(record);
    form.setFieldsValue({
      name: record.name,
      content: record.content,
      description: record.description,
      prompt: record.prompt,
      isActive: record.isActive
    });
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingTask) {
        const updatedTasks = tasks.map(t => 
          t.id === editingTask.id ? { ...t, ...values } : t
        );
        setTasks(updatedTasks);
        message.success('Đã cập nhật tác vụ thành công');
      } else {
        const newTask: TaskType = {
          id: `task-${Date.now()}`,
          ...values
        };
        setTasks([newTask, ...tasks]);
        message.success('Đã thêm tác vụ mới');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const columns = [
    {
      title: 'Tên tác vụ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ...getColumnSearchProps('name'),
      render: (text: string) => <span className="font-semibold text-slate-900">{text}</span>
    },
    {
      title: 'Nội dung tác vụ',
      dataIndex: 'content',
      key: 'content',
      width: 250,
      ...getColumnSearchProps('content'),
    },
    {
      title: 'Mô tả thao tác',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (text: string) => <div className="whitespace-pre-wrap text-sm">{text}</div>
    },
    {
      title: 'Prompt AI',
      dataIndex: 'prompt',
      key: 'prompt',
      width: 300,
      render: (text: string) => <div className="whitespace-pre-wrap text-sm italic text-slate-600">{text}</div>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center' as const,
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#2db7f5' : undefined }} />
      ),
      onFilter: (value: any, record: TaskType) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: TaskType) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          style={{ color: '#2db7f5' }}
          onClick={() => handleEditClick(record)}
        />
      )
    }
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 bg-white shrink-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 className="text-2xl font-bold m-0" style={{ color: '#001529' }}>
          Quản lý tác vụ
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#eff0f9' }}>
        <div>
          {/* Section Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold m-0" style={{ color: '#001529' }}>
              Thông tin tác vụ
            </h2>
            <Button 
              type="dashed" 
              size="small" 
              icon={<EditOutlined />}
              onClick={handleAddClick}
            >
              Thêm tác vụ
            </Button>
          </div>

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

      {/* Edit Modal */}
      <Modal
        title={editingTask ? "Sửa tác vụ" : "Thêm tác vụ mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu lại"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Tên tác vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác vụ' }]}
          >
            <Input placeholder="Nhập tên tác vụ" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung tác vụ"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung tác vụ' }]}
          >
            <TextArea rows={2} placeholder="Nhập nội dung chi tiết" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả thao tác"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả thao tác' }]}
          >
            <TextArea rows={3} placeholder="Mô tả các bước thực hiện thao tác này" />
          </Form.Item>
          <Form.Item
            name="prompt"
            label="Prompt AI"
            rules={[{ required: true, message: 'Vui lòng nhập Prompt AI để hướng dẫn bot' }]}
          >
            <TextArea rows={3} placeholder="Ví dụ: Bạn là trợ lý ảo hỗ trợ... Khi nhận yêu cầu, hãy..." />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Trạng thái hoạt động"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
