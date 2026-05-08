import React, { useState, useRef } from 'react';
import { Card, Table, Timeline, Typography, Tag, Space, Divider, Button, Modal, Radio, Input, Select, Breadcrumb, Descriptions, Collapse, Form, Checkbox, Row, Col } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, ReloadOutlined, CloseCircleOutlined, CodeOutlined, SearchOutlined, ArrowLeftOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';

const { Title, Text } = Typography;

interface Ticket {
  id: string;
  code: string;
  title: string;
  status: string;
  processingTime: number; // in seconds
  date: string;
  isFailed?: boolean;
  processingType?: string;
  // PS specific fields
  customerName?: string;
  customerPhone?: string;
  topicName?: string;
  sourceName?: string;
  priority?: string;
  description?: string;
}

const mockTicketsPS: Ticket[] = [
  { 
    id: '69fd6ebdb2537a761fc61806', 
    code: 'TC-063224', 
    title: 'JCB Anh Dương Đăng Chính 0936152366 outbound', 
    status: 'Hoàn thành', 
    processingTime: 125, 
    date: '2026-05-08 10:30:00',
    customerName: 'Trần Huyền Chinh',
    customerPhone: '0944362603',
    topicName: 'Tư vấn thông tin',
    sourceName: 'Zalo/Email',
    priority: 'normal',
    description: 'Ticket chat'
  },
  { 
    id: '69fd6ebdb2537a761fc61807', 
    code: 'TC-063225', 
    title: 'Hỗ trợ đổi quà App UrBox - KH 0988222333', 
    status: 'Phân tích và Chuẩn bị dữ liệu', 
    processingTime: 45, 
    date: '2026-05-08 11:15:20',
    customerName: 'Nguyễn Thanh Lan',
    customerPhone: '0988222333',
    topicName: 'Hỗ trợ App',
    sourceName: 'Zalo',
    priority: 'medium'
  }
];

const mockTicketsEG: Ticket[] = [
  { id: '69fc606304d5a8841cc9a717', code: 'TC-200424', title: 'Xử lý file ghi âm cuộc họp A', status: 'Tạo ticket Lark', processingTime: 88, date: '2026-05-06 09:30:45', processingType: 'Phòng ban khác' },
  { id: '69fc606304d5a8841cc9a718', code: 'TC-200425', title: 'Bóc băng ghi âm phỏng vấn', status: 'Xử lý transcript', processingTime: 12, date: '2026-05-05 14:20:12', processingType: 'CSKH' },
  { id: '69fc606304d5a8841cc9a719', code: 'TC-200426', title: 'Audio khiếu nại khách hàng', status: 'Nhận audio', processingTime: 5, date: '2026-05-04 10:05:00', processingType: 'CSKH' },
  { id: '69fc606304d5a8841cc9a71a', code: 'TC-200427', title: 'Xử lý file meeting tuần', status: 'Hoàn thành', processingTime: 156, date: '2026-05-06 16:45:30', processingType: 'CSKH' },
  { id: '69fc606304d5a8841cc9a71b', code: 'TC-200428', title: 'Lỗi ghi âm không rõ tiếng', status: 'Phân tích và Chuẩn bị dữ liệu', processingTime: 30, date: '2026-05-06 08:15:00', isFailed: true, processingType: 'Phòng ban khác' },
];

const mockJourney = [
  {
    status: 'Nhận audio',
    time: '04-05-2026 09:05',
    description: 'Đã nhận file audio đính kèm. Đang chuẩn bị đẩy qua model.',
    color: 'cyan'
  },
  {
    status: 'Xử lý transcript',
    time: '04-05-2026 09:20',
    description: 'Audio đã được chuyển đổi thành văn bản (transcript) thành công.',
    color: 'green'
  },
  {
    status: 'Phân tích và Chuẩn bị dữ liệu',
    time: '04-05-2026 09:25',
    description: 'Phân tích keyword từ transcript và xuất file JSON để chuẩn bị cập nhật thông tin.',
    color: 'blue',
    hasJson: true
  },
  {
    status: 'Tạo ticket Lark',
    time: '04-05-2026 10:00',
    description: 'Hệ thống tự động tạo ticket trên Lark để chuyển giao cho phòng ban liên quan.',
    color: 'purple'
  },
  {
    status: 'Update Ticket',
    time: '04-05-2026 10:30',
    description: 'Cập nhật toàn bộ thông tin đã trích xuất vào field của Ticket trên hệ thống.',
    color: 'magenta'
  }
];

export const TicketManager: React.FC = () => {
  const [currentType, setCurrentType] = useState<'ps' | 'eg'>('ps');
  const tickets = currentType === 'ps' ? mockTicketsPS : mockTicketsEG;
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: keyof Ticket) => ({
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
    onFilter: (value: any, record: Ticket) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const getStatusSearchProps = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Space align="baseline" style={{ gap: 8 }}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            suffixIcon={null}
            placeholder="Tìm trạng thái"
            value={selectedKeys}
            onChange={(values) => setSelectedKeys(values)}
            style={{ display: 'block', maxWidth: 500, minWidth: 150 }}
            options={[
              ...mockJourney.map(item => ({ label: item.status, value: item.status })),
              { label: 'Hoàn thành', value: 'Hoàn thành' },
              { label: 'Lỗi', value: 'failed' }
            ]}
          />
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm();
            }}
            size="small"
            style={{ width: 80 }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 80 }}
          >
            Ok
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#2db7f5' : undefined }} />
    ),
    onFilter: (value: any, record: Ticket) => {
      if (value === 'failed') return record.isFailed;
      return record.status === value;
    },
  });

  const handleRetry = () => {
    if (selectedTicket) {
      const updatedTicket = { ...selectedTicket, isFailed: false };
      const updatedTickets = tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
      setTickets(updatedTickets);
      setSelectedTicket(updatedTicket);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      ...getColumnSearchProps('id'),
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      ...getColumnSearchProps('code'),
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Thời gian xử lý',
      dataIndex: 'processingTime',
      key: 'processingTime',
      width: 150,
      render: (time: number, record: Ticket) => 
        record.status === 'Hoàn thành' ? <Text>{time} giây</Text> : <Text>-</Text>,
    },
    {
      title: 'Trạng thái hiện tại',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      ...getStatusSearchProps(),
      render: (status: string, record: Ticket) => {
        if (record.isFailed) {
          return (
            <Tag color="error" icon={<CloseCircleOutlined />}>
              Lỗi
            </Tag>
          );
        }
        let color = 'default';
        switch (status) {
          case 'Nhận audio': color = 'cyan'; break;
          case 'Xử lý transcript': color = 'green'; break;
          case 'Phân tích và Chuẩn bị dữ liệu': color = 'blue'; break;
          case 'Tạo ticket Lark': color = 'purple'; break;
          case 'Update Ticket': color = 'orange'; break;
          case 'Hoàn thành': color = 'magenta'; break;
        }
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  const handleTicketClick = (record: Ticket) => {
    setSelectedTicket(record);
    setViewMode('detail');
  };

  if (viewMode === 'detail' && selectedTicket) {
    const currentStepIndex = mockJourney.findIndex(s => s.status === selectedTicket.status);
    const aiStepIndex = mockJourney.findIndex(s => s.status === 'Phân tích và Chuẩn bị dữ liệu');
    const isAiDone = currentStepIndex > aiStepIndex;

    return (
      <div className="flex flex-col h-screen bg-[#f0f2f5]">
        <div className="p-6 bg-white shrink-0 mb-5">
          <div className="flex items-center gap-4">
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              size="large"
              onClick={() => setViewMode('list')} 
              className="hover:bg-slate-100 rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold m-0" style={{ color: '#001529' }}>
                Chi tiết ticket {selectedTicket.code}
              </h1>
            </div>
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto px-[20px] pb-[20px] custom-scrollbar">
          <div className="w-full space-y-6">
            
            {/* 1. Thông tin chung */}
            <Collapse 
              defaultActiveKey={['1']} 
              expandIconPosition="end"
              className="shadow-sm border-0 bg-white"
              style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}
            >
              <Collapse.Panel 
                header={<Text strong style={{ fontSize: '16px' }}>Chi tiết ticket</Text>} 
                key="1"
              >
                <div className="space-y-6">
                  {/* 1.1 Thông tin hệ thống */}
                  <div>
                    <Text strong className="block mb-3 text-slate-500 text-xs">Thông tin hệ thống</Text>
                    <Descriptions 
                      column={2} 
                      bordered 
                      size="small" 
                      className="bg-white" 
                      style={{ tableLayout: 'fixed' }}
                      labelStyle={{ width: '20%', minWidth: '150px', fontWeight: 'bold', color: '#555' }}
                      contentStyle={{ width: '30%' }}
                    >
                      <Descriptions.Item label="ID ticket">{selectedTicket.id}</Descriptions.Item>
                      <Descriptions.Item label="Loại dịch vụ">{currentType === 'ps' ? 'Premium Service' : 'eGift / OCR'}</Descriptions.Item>
                      <Descriptions.Item label="Code ticket">{selectedTicket.code}</Descriptions.Item>
                      <Descriptions.Item label="Trạng thái hiện tại">
                        <Tag color={selectedTicket.isFailed ? 'error' : (() => {
                          let color = 'default';
                          switch (selectedTicket.status) {
                            case 'Phân tích và Chuẩn bị dữ liệu': color = 'blue'; break;
                            case 'Tạo ticket Lark': color = 'purple'; break;
                            case 'Xử lý transcript': color = 'green'; break;
                            case 'Update Ticket': color = 'orange'; break;
                            case 'Hoàn thành': color = 'magenta'; break;
                          }
                          return color;
                        })()} icon={selectedTicket.isFailed ? <CloseCircleOutlined /> : null}>
                          {selectedTicket.isFailed ? 'Lỗi' : selectedTicket.status}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Tổng thời gian xử lý">
                        {selectedTicket.status === 'Hoàn thành' ? `${selectedTicket.processingTime} giây` : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày tạo">{selectedTicket.date}</Descriptions.Item>
                    </Descriptions>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  {/* 1.2 Dữ liệu phân tích từ AI */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Text strong className="text-blue-700 text-xs">Thông tin ticket được AI xử lý</Text>
                    </div>
                    <Descriptions 
                      column={2} 
                      size="small" 
                      bordered 
                      className="bg-white" 
                      style={{ tableLayout: 'fixed' }}
                      labelStyle={{ width: '20%', minWidth: '150px', fontWeight: 'bold', color: '#555' }}
                      contentStyle={{ width: '30%' }}
                    >
                      {currentType === 'ps' ? (
                        <>
                          <Descriptions.Item label="noi-dung-chi-tiet">{isAiDone ? "Tư vấn, giải đáp thông tin" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="chuong-trinh---du-an">{isAiDone ? "Zalo/Email" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="loai-dich-vu">{isAiDone ? "Không có dịch vụ cụ thể" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="noi-dung-cuoc-goi">{isAiDone ? "Zalo/Email: Tư vấn" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="ma-psub">{isAiDone ? "0" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="do-uu-tien">{isAiDone ? "Bình thường ( >24 giờ)" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="sla">{isAiDone ? "24~48 giờ" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="kenh-su-dung">{isAiDone ? "Zalo/Email" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="doanh-nghiep">{isAiDone ? "JCB" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="doi-tuong-khach-hang">{isAiDone ? "Khách hàng Premium" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="chuong-trinh">{isAiDone ? "JCB Premium Service" : "-"}</Descriptions.Item>
                        </>
                      ) : (
                        <>
                          <Descriptions.Item label="doi-tuong-kh">{isAiDone ? "KH cá nhân" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="nhom-nghiep-vu">{isAiDone ? "EGIFT" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="chuong-trinh">{isAiDone ? "UrBox App" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="kenh-su-dung">{isAiDone ? "UrBox App" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="san-pham">{isAiDone ? "E-voucher" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="ma-voucherso-the">{isAiDone ? "URXDB09R4" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="thuong-hieu">{isAiDone ? "Yen Sushi & Sake Pub" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="nhom-yeu-cau">{isAiDone ? "Tư vấn/Hỗ trợ" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="noi-dung-cau-hoi">{isAiDone ? "Tư vấn thông tin sản phẩm" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="van-de-cu-the">{isAiDone ? "Tv thông tin sử dụng voucher" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="nguyen-nhan-chi-tiet">{isAiDone ? "KH lỡ đánh dấu đã sử dụng" : "-"}</Descriptions.Item>
                          <Descriptions.Item label="phuong-an-xu-ly">
                            {isAiDone ? (selectedTicket.processingType || "Không ảnh hưởng đến tình trạng sử dụng voucher") : "-"}
                          </Descriptions.Item>
                        </>
                      )}
                    </Descriptions>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* 2. Hành trình xử lý (Timeline) */}
            <Card 
              title={<Text strong style={{ fontSize: '16px' }}>Hành trình xử lý</Text>}
              className="shadow-sm border-0"
              style={{ borderRadius: '12px' }}
              headStyle={{ padding: '12px 16px' }}
            >
              <div className="px-4 py-2">
                <Timeline
                  mode="left"
                  items={mockJourney.map((step, index) => {
                    let currentStepIndex = mockJourney.findIndex(s => s.status === selectedTicket?.status);
                    if (selectedTicket?.status === 'Hoàn thành') {
                      currentStepIndex = mockJourney.length; // All steps completed
                    }
                    const isSkipped = step.status === 'Tạo ticket Lark' && selectedTicket?.processingType !== 'Phòng ban khác';
                    
                    let isCompleted = index < currentStepIndex && !isSkipped;
                    const isActive = index === currentStepIndex;
                    const isPending = currentStepIndex !== -1 && index > currentStepIndex;
                    const isFailedStep = isActive && selectedTicket?.isFailed;

                    let dotColor = 'gray';
                    if (isCompleted) dotColor = 'green';
                    if (isActive) dotColor = isFailedStep ? 'red' : 'blue';
                    if (isSkipped) dotColor = 'gray';

                    let dotIcon = null;
                    if (isActive) {
                      dotIcon = isFailedStep ? 
                        <CloseCircleOutlined className="text-red-500" style={{ fontSize: '16px' }} /> : 
                        <ClockCircleOutlined className="animate-spin text-blue-500" style={{ fontSize: '16px' }} />;
                    }

                    return {
                      color: dotColor,
                      dot: dotIcon,
                      children: (
                        <div className={`mb-4 ${isPending || isSkipped ? 'opacity-40' : ''}`}>
                          <div className="flex justify-between items-center mb-1">
                            <Text strong={isCompleted || isActive} type={isPending || isSkipped ? 'secondary' : isFailedStep ? 'danger' : undefined}>
                              {step.status} {isSkipped && '(Bỏ qua)'}
                            </Text>
                            <Text type="secondary" className="text-xs">{step.time}</Text>
                          </div>
                          <Text className="text-sm block mb-2" type={isPending || isSkipped ? 'secondary' : isFailedStep ? 'danger' : undefined}>
                            {isFailedStep ? 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng kiểm tra lại cấu hình hoặc thử lại.' : 
                              isSkipped ? 'Không yêu cầu chuyển tiếp sang phòng ban khác.' : step.description}
                          </Text>
                          <Space wrap>
                            {step.status === 'Xử lý transcript' && !isPending && (
                              <Button 
                                type="dashed" 
                                size="small" 
                                icon={<FileTextOutlined />}
                                onClick={() => setIsTranscriptModalOpen(true)}
                              >
                                Xem transcript
                              </Button>
                            )}
                            {step.hasJson && !isPending && (
                              <Button 
                                type="dashed" 
                                size="small" 
                                icon={<CodeOutlined />}
                                onClick={() => setIsJsonModalOpen(true)}
                              >
                                Xem file JSON
                              </Button>
                            )}
                            {isFailedStep && step.status !== 'Nhận audio' && (
                              <Button 
                                type="primary" 
                                danger 
                                size="small" 
                                icon={<ReloadOutlined />}
                                onClick={handleRetry}
                              >
                                Thử lại
                              </Button>
                            )}
                          </Space>
                        </div>
                      ),
                    };
                  })}
                />
              </div>
            </Card>



          </div>
        </div>
        
        {/* Modals reuse */}
        <Modal
          title={`Transcript - ${selectedTicket.title}`}
          open={isTranscriptModalOpen}
          onCancel={() => setIsTranscriptModalOpen(false)}
          footer={[<Button key="close" onClick={() => setIsTranscriptModalOpen(false)}>Đóng</Button>]}
          width={700}
        >
          <div className="bg-slate-100 p-4 rounded-md mt-4 max-h-[400px] overflow-y-auto font-sans">
            <p className="text-sm mb-3"><strong className="text-blue-600">Khách hàng:</strong> Alo, dạ cho hỏi bên mình có hỗ trợ xử lý thẻ tín dụng bị khoá không ạ?</p>
            <p className="text-sm mb-3"><strong className="text-emerald-600">Tư vấn viên:</strong> Dạ chào anh/chị, bên em có hỗ trợ ạ. Anh/chị vui lòng cho em xin số CMND hoặc CCCD để em kiểm tra thông tin nhé.</p>
          </div>
        </Modal>

        <Modal
          title={`JSON Extraction - ${selectedTicket.code}`}
          open={isJsonModalOpen}
          onCancel={() => setIsJsonModalOpen(false)}
          footer={[<Button key="close" onClick={() => setIsJsonModalOpen(false)}>Đóng</Button>]}
          width={700}
        >
          <div className="bg-slate-50 p-4 rounded-md mt-4 max-h-[400px] overflow-y-auto font-mono text-xs text-slate-800 border border-slate-200">
            <pre>{JSON.stringify(currentType === 'ps' ? {
              "_id": selectedTicket.id,
              "client": "67e644fd19016798b0c2db7e",
              "parent": null,
              "user": "67ea14aeba71627f1f02b496",
              "call": null,
              "users": [],
              "customer": "69f9a2e042c59335812ee2f7",
              "source": null,
              "topic": {
                "_id": "690ad63d04f18dd3b3d22ef5",
                "code": "TU-VAN-THONG-TIN",
                "name": selectedTicket.topicName || "Tư vấn thông tin",
                "desc": "",
                "subject": "Tư vấn thông tin - Tên KH",
                "content": "",
                "position": 0,
                "active": true,
                "department": "67e644fe19016798b0c2dbab",
                "sla": "67e644fe19016798b0c2dbbb",
                "priority": selectedTicket.priority || "normal",
                "groups": [],
                "user": null,
                "users": [],
                "customFields": [
                  { "key": "noi-dung-chi-tiet", "val": ["Tư vấn, giải đáp thông tin"] },
                  { "key": "chuong-trinh---du-an", "val": ["Zalo/Email"] },
                  { "key": "loai-dich-vu", "val": ["Không có dịch vụ cụ thể"] },
                  { "key": "noi-dung-cuoc-goi", "val": ["Zalo/Email: Tư vấn"] },
                  { "key": "ma-psub", "val": ["0"] },
                  { "key": "do-uu-tien", "val": ["Bình thường ( >24 giờ)"] },
                  { "key": "sla", "val": ["24~48 giờ"] },
                  { "key": "kenh-su-dung", "val": ["Zalo/Email"] }
                ],
                "createTime": 1762317885676,
                "client": "67e644fd19016798b0c2db7e",
                "__v": 1
              },
              "department": null,
              "sla": null,
              "priority": selectedTicket.priority || "normal",
              "code": selectedTicket.code,
              "name": selectedTicket.title,
              "desc": selectedTicket.description || "Ticket chat",
              "customFields": [
                { "key": "noi-dung-chi-tiet", "val": ["Tư vấn, giải đáp thông tin"] },
                { "key": "chuong-trinh---du-an", "val": ["Zalo/Email"] },
                { "key": "loai-dich-vu", "val": ["Không có dịch vụ cụ thể"] },
                { "key": "noi-dung-cuoc-goi", "val": ["Zalo/Email: Tư vấn"] },
                { "key": "ma-psub", "val": ["0"] },
                { "key": "do-uu-tien", "val": ["Bình thường ( >24 giờ)"] },
                { "key": "sla", "val": ["24~48 giờ"] },
                { "key": "kenh-su-dung", "val": ["Zalo/Email"] }
              ],
              "supportTime": 0,
              "replyTime": 0,
              "closeTime": 0,
              "closeUser": null,
              "expireTime": 1778657097816,
              "lastNumber": 62738,
              "notifyTime": 0,
              "ref": "automation_69fad868c706ea0b8311395e",
              "archive": false,
              "createTime": 1778052297818,
              "files": [],
              "__v": 0,
              "populatedCustomer": {
                "_id": "69f9a2e042c59335812ee2f7",
                "name": selectedTicket.customerName || "Trần Huyền Chinh",
                "phone": selectedTicket.customerPhone || "0944362603",
                "code": "KH27538",
                "__v": 1,
                "customFields": [
                  { "key": "doanh-nghiep", "val": ["JCB"] },
                  { "key": "doi-tuong-khach-hang", "val": ["Khách hàng Premium"] },
                  { "key": "chuong-trinh", "val": ["JCB Premium Service"] }
                ]
              },
              "populatedUser": {
                "_id": "67ea14aeba71627f1f02b496",
                "email": selectedTicket.creator,
                "name": selectedTicket.creator,
                "ext": "10007"
              }
            } : {
              "_id": selectedTicket.id,
              "client": "67e8b0f10d8b1eafa894523b",
              "parent": null,
              "user": "686f31e0631be48f6a6ea216",
              "call": "69dc92cf1ada662323ca2dbd",
              "users": [],
              "customer": "69dc92735b9340affc2baabc",
              "source": {
                "_id": "67e8b0f10d8b1eafa894527d",
                "name": "Điện thoại"
              },
              "topic": {
                "_id": "67fdc583aacbd3310b348229",
                "code": "CUOC-GOI-VAO",
                "name": "Cuộc gọi vào"
              },
              "priority": "normal",
              "code": selectedTicket.code,
              "name": selectedTicket.title,
              "desc": "..",
              "customFields": [
                { "key": "doi-tuong-kh", "val": ["KH cá nhân"] },
                { "key": "nhom-nghiep-vu", "val": ["EGIFT"] },
                { "key": "nhom-yeu-cau", "val": ["Tư vấn/Hỗ trợ"] },
                { "key": "phuong-an-xu-ly", "val": [selectedTicket.processingType || "Không ảnh hưởng đến tình trạng sử dụng voucher"] }
              ],
              "createTime": 1776063184202,
              "updateTime": 1776063278774,
              "populatedCustomer": {
                "name": "Nguyễn Kim Phượng",
                "phone": "0902680025",
                "code": "KH118222"
              }
            }, null, 2)}</pre>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 bg-white shrink-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ margin: 0, color: '#001529' }}>Quản lý Ticket</Title>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#eff0f9' }}>
        {/* Type Switcher */}
        <div className="mb-6">
          <Radio.Group
            value={currentType}
            onChange={e => {
              setCurrentType(e.target.value);
              setSelectedTicket(null);
              setViewMode('list');
            }}
            optionType="button"
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="ps" style={{ width: '180px', textAlign: 'center' }}>
              Premium Service
            </Radio.Button>
            <Radio.Button value="eg" style={{ width: '180px', textAlign: 'center' }}>
              eGift / OCR
            </Radio.Button>
          </Radio.Group>
        </div>

        <div className="bg-white rounded shadow-sm p-4" style={{ border: '1px solid #f0f0f0' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold m-0" style={{ color: '#001529' }}>
              Danh sách Ticket
            </h2>
          </div>
          <Table 
            dataSource={tickets} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
            onRow={(record) => {
              return {
                onClick: () => handleTicketClick(record),
                style: { cursor: 'pointer' }
              };
            }}
          />
        </div>
      </div>
    </div>
  );
};
