import React, { useState, useMemo, useRef } from 'react';
import { Button, Radio, Tag, Table, Input, Space, Modal, message, Form, Select, InputNumber, Checkbox, Row, Col, Switch, Badge } from 'antd';
import { EditOutlined, SearchOutlined, SaveOutlined, PlusOutlined, CloseOutlined, CloudUploadOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { InputRef } from 'antd';
import { PS_DATA, EG_DATA, FieldType } from './data';
import { FieldDetailScreen } from './FieldDetailScreen';

interface FieldSummary {
  fieldId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: 'System' | 'Custom';
  optionCount: number;
  keywordCount: number;
  exampleOptions: string[];
  isActive: boolean;
  isEditing?: boolean;
  id: string;
}

export const CaliloFieldManager: React.FC = () => {
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [currentType, setCurrentType] = useState<'ps' | 'eg'>('ps');
  const [form] = Form.useForm();
  
  const [psFields, setPsFields] = useState<FieldType[]>(PS_DATA);
  const [egFields, setEgFields] = useState<FieldType[]>(EG_DATA);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [inputType, setInputType] = useState('one');
  const [addedOptions, setAddedOptions] = useState<string[]>([]);
  const [tempOptionInput, setTempOptionInput] = useState('');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const searchInput = useRef<InputRef>(null);

  const currentFields = currentType === 'ps' ? psFields : egFields;
  const setFields = currentType === 'ps' ? setPsFields : setEgFields;

  const fieldsBySection = useMemo(() => {
    const sourceData = currentFields;
    let currentSection = '';
    const sections: { [key: string]: any[] } = {};

    sourceData.forEach((item) => {
      // Chỉ coi là tiêu đề nhóm nếu CÓ section và KHÔNG CÓ id
      if (item.section && !item.id) {
        currentSection = item.section;
        if (!sections[currentSection]) sections[currentSection] = [];
        return;
      }
      
      if (!item.id) return;

      const totalKeywords = item.options ? item.options.reduce((sum, opt) => {
        if (opt.kw && !opt.readonly) {
          const kws = opt.kw.replace(/^\[Mẫu\]\s*/, '').split(',').filter(k => k.trim());
          return sum + kws.length;
        }
        return sum;
      }, 0) : 0;

      sections[currentSection].push({
        ...item,
        fieldId: item.id,
        fieldKey: item.id,
        fieldLabel: item.name || '',
        fieldType: item.system ? 'System' : 'Custom',
        optionCount: item.options ? item.options.filter(o => !o.readonly).length : 0,
        keywordCount: totalKeywords,
        isActive: item.active !== false,
      });
    });
    return sections;
  }, [currentFields]);

  const showAddFieldModal = (sectionName: string) => {
    setEditingFieldId(null);
    setActiveSection(sectionName);
    form.resetFields();
    setAddedOptions([]);
    setTempOptionInput('');
    form.setFieldsValue({
      type: 'one',
      position: currentFields.length + 1,
      active: true,
      required: true
    });
    setInputType('one');
    setIsModalOpen(true);
  };

  const handleEditField = (record: any) => {
    setEditingFieldId(record.id);
    setActiveSection(record.section || '');
    form.setFieldsValue({
      label: record.name,
      code: record.id,
      position: record.position || 1,
      type: record.type || 'one',
      displayType: record.displayType || '',
      active: record.active !== false,
      required: record.req === true,
      listPerLine: record.listPerLine || false
    });
    setInputType(record.type || 'one');
    setAddedOptions(record.options ? record.options.map((o: any) => o.val) : []);
    setIsModalOpen(true);
  };

  const handleAddOptionToList = () => {
    if (!tempOptionInput.trim()) return;
    
    // Tách chuỗi theo dấu ;
    const newVals = tempOptionInput
      .split(';')
      .map(v => v.trim())
      .filter(v => v && !addedOptions.includes(v));
    
    if (newVals.length > 0) {
      setAddedOptions([...addedOptions, ...newVals]);
      setTempOptionInput('');
    }
  };

  const handleRemoveOptionFromList = (val: string) => {
    setAddedOptions(addedOptions.filter(o => o !== val));
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const fieldData: FieldType & { syncStatus?: string } = {
        id: values.code,
        fieldId: values.code,
        name: values.label,
        section: activeSection,
        req: values.required,
        type: values.type, // Lưu lại kiểu nhập liệu
        active: values.active,
        options: addedOptions.map(v => ({ val: v, syncStatus: 'pending' })), // Option mới mang trạng thái New
        system: false,
        syncStatus: 'pending'
      };

      let newFields = [...currentFields];
      if (editingFieldId) {
        newFields = newFields.map(f => f.id === editingFieldId ? { ...f, ...fieldData, syncStatus: f.syncStatus } : f);
      } else {
        const lastIndexInSection = [...currentFields].reverse().findIndex(f => f.section === activeSection);
        const actualIndex = currentFields.length - lastIndexInSection;
        newFields.splice(actualIndex, 0, fieldData);
      }

      setFields(newFields);
      setIsModalOpen(false);
      message.success(editingFieldId ? 'Đã cập nhật Field' : 'Đã thêm Field mới vào danh sách');
    });
  };

  const handleSyncFieldToCallio = (id: string) => {
    message.loading({ content: 'Đang đồng bộ cấu trúc Field và các Option lên Callio...', key: 'syncField' });

    setTimeout(() => {
      const newFields = currentFields.map(f => {
        if (f.id === id) {
          // Đồng bộ Field và toàn bộ Option bên trong
          const syncedOptions = f.options?.map(opt => ({ ...opt, syncStatus: 'synced' as const }));
          return { ...f, syncStatus: 'synced', options: syncedOptions };
        }
        return f;
      });
      setFields(newFields as FieldType[]);
      message.success({ content: 'Đã đồng bộ Field và Option lên Callio thành công!', key: 'syncField' });
    }, 1500);
  };

  const getModalTitle = () => {
    return activeSection.includes('KHÁCH HÀNG') 
      ? 'Thêm mới thông tin tuỳ biến Khách hàng' 
      : 'Thêm mới thông tin tuỳ biến Ticket';
  };

  // Hàm tự động sinh Mã từ Nhãn hiển thị (Logic Slug chuẩn: chuong-trinh-du-an)
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    form.setFieldsValue({ label: val });
    
    // Logic: Tiếng Việt có dấu -> không dấu, ký tự đặc biệt -> '-', gộp nhiều '-' thành 1
    const generatedCode = val
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Thay ký tự đặc biệt bằng '-'
      .replace(/-+/g, '-')        // GỘP nhiều dấu '-' liên tiếp thành 1 dấu '-'
      .replace(/^-+|-+$/g, '');   // Xóa gạch ngang ở đầu và cuối
      
    form.setFieldsValue({ code: generatedCode });
  };

  const allFields = useMemo(() => {
    return Object.values(fieldsBySection).flat();
  }, [fieldsBySection]);

  const totalStats = useMemo(() => {
    return {
      totalFields: allFields.length,
      totalOptions: allFields.reduce((sum, f) => sum + f.optionCount, 0),
      totalKeywords: allFields.reduce((sum, f) => sum + f.keywordCount, 0)
    };
  }, [allFields]);

  const handleFieldClick = (fieldSummary: any) => {
    // Tìm field trong state thay vì dữ liệu tĩnh
    const field = currentFields.find(f => f.id === fieldSummary.fieldId);
    if (field) {
      setSelectedField(field);
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: keyof FieldSummary) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm field...`}
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
    onFilter: (value: any, record: FieldSummary) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const filteredFields = useMemo(() => {
    return Object.values(fieldsBySection).flat();
  }, [fieldsBySection]);

  if (selectedField) {
    return (
      <FieldDetailScreen
        field={selectedField}
        onBack={() => setSelectedField(null)}
      />
    );
  }

  const handleToggleActive = (id: string, active: boolean) => {
    const newFields = currentFields.map(f => f.id === id ? { ...f, active } : f);
    setFields(newFields);
    message.success(`Đã ${active ? 'bật' : 'tắt'} sử dụng field`);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Calilo Key',
      dataIndex: 'fieldKey',
      key: 'fieldKey',
      width: 120,
      ...getColumnSearchProps('fieldKey'),
      render: (text: string) => (
        <span className="text-slate-600 font-mono text-xs">{text}</span>
      )
    },
    {
      title: 'Field',
      dataIndex: 'fieldLabel',
      key: 'fieldLabel',
      width: 250,
      ...getColumnSearchProps('fieldLabel' as any),
      render: (text: string, record: any) => (
        <Space>
          <span className="font-semibold text-slate-900">{text}</span>
          {record.req && (
            <Tag color="error" style={{ fontSize: '10px', lineHeight: '16px', borderRadius: '4px' }}>
              Bắt buộc
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: 'Field Type',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 110,
      align: 'center' as const,
      render: (type: 'System' | 'Custom') => (
        <Tag color={type === 'Custom' ? 'blue' : 'default'}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Kiểu nhập liệu',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      align: 'center' as const,
      render: (type: string, record: any) => {
        const typeMap: Record<string, string> = {
          'text': 'Nhập chữ',
          'paragraph': 'Đoạn văn',
          'number': 'Số',
          'date': 'Thời gian',
          'day': 'Ngày',
          'one': 'Chọn một',
          'multiple': 'Chọn nhiều',
          'tags': 'Thẻ'
        };
        // Các field cũ trước đây: nếu có option -> Chọn một, nếu không có -> Nhập chữ
        const fallbackType = record.optionCount > 0 ? 'one' : 'text';
        const label = typeMap[type || fallbackType] || 'Chọn một';
        return <span className="text-slate-700">{label}</span>;
      }
    },
    {
      title: 'Sử dụng',
      key: 'active',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Switch 
          size="small" 
          checked={record.isActive} 
          disabled={record.fieldType === 'System'}
          onChange={(checked) => handleToggleActive(record.id, checked)}
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 110,
      align: 'center' as const,
      render: (_: any, record: any) => {
        if (!record.isActive) {
          return <Tag color="default">Inactive</Tag>;
        }
        if (record.syncStatus === 'pending') {
          return <Tag color="gold">New</Tag>;
        }
        return <Tag color="green">Active</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => {
        const isClickable = record.optionCount > 0 || record.fieldType === 'Custom' || record.syncStatus === 'pending';
        
        if (!isClickable && record.fieldType === 'System') {
          return <span className="text-slate-400 text-xs">N/A</span>;
        }
        return (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditField(record);
              }}
              style={{ color: '#2db7f5' }}
            />
            {record.syncStatus === 'pending' && (
              <Button
                type="text"
                size="small"
                icon={<CloudUploadOutlined style={{ color: '#faad14' }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSyncFieldToCallio(record.id);
                }}
                title="Đồng bộ cấu trúc Field lên Callio"
              />
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 bg-white shrink-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 className="text-2xl font-bold m-0" style={{ color: '#001529' }}>
          Quản lý Keyword Mapping cho AI
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#eff0f9' }}>
        {/* Type Switcher */}
        <div className="mb-6">
          <Radio.Group
            value={currentType}
            onChange={e => setCurrentType(e.target.value)}
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

        {/* Sections */}
        {Object.entries(fieldsBySection).map(([sectionName, fields], sectionIndex) => {
          // Convert to title case
          const formattedSectionName = sectionName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

          return (
            <div key={sectionName} className={sectionIndex > 0 ? 'mt-8' : ''}>
              {/* Section Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold m-0" style={{ color: '#001529' }}>
                  {formattedSectionName}
                </h2>
                <Button 
                  type="dashed" 
                  size="small" 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    showAddFieldModal(sectionName);
                  }}
                >
                  Thêm Field
                </Button>
              </div>

              {/* Section Table */}
              <div className="bg-white rounded shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                <Table
                  columns={columns}
                  dataSource={fields}
                  rowKey={(record) => record.id}
                  pagination={false}
                  bordered
                  onRow={(record) => {
                    const isClickable = record.optionCount > 0 || record.fieldType === 'Custom' || record.syncStatus === 'pending';
                    return {
                      onClick: () => {
                        if (isClickable) {
                          handleFieldClick(record);
                        }
                      },
                      className: isClickable ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                    };
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Summary Stats */}
        <div className="mt-6 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Tổng:</span>{' '}
          {allFields.length} fields
        </div>
      </div>

      {/* Modal Thêm Field */}
      <Modal
        title={getModalTitle()}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Huỷ"
        width={650}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: 'one', displayType: '', active: true, required: true }}
          className="py-4"
        >
          <Form.Item
            name="label"
            label="Nhãn hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập nhãn hiển thị' }]}
          >
            <Input placeholder="Nhập nhãn hiển thị" onChange={handleLabelChange} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã"
                rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
              >
                <Input placeholder="Ví dụ: NGAY_SINH" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Vị trí"
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Kiểu nhập liệu"
              >
                <Select onChange={val => setInputType(val)}>
                  <Select.Option value="text">Nhập chữ</Select.Option>
                  <Select.Option value="paragraph">Đoạn văn</Select.Option>
                  <Select.Option value="number">Số</Select.Option>
                  <Select.Option value="date">Thời gian</Select.Option>
                  <Select.Option value="day">Ngày</Select.Option>
                  <Select.Option value="one">Chọn một</Select.Option>
                  <Select.Option value="multiple">Chọn nhiều</Select.Option>
                  <Select.Option value="tags">Thẻ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="displayType"
                label="Loại hiển thị"
              >
                <Select>
                  <Select.Option value="">Mặc định</Select.Option>
                  <Select.Option value="list">Dạng danh sách</Select.Option>
                  <Select.Option value="dropdown">Dạng danh mục thả xuống</Select.Option>
                  <Select.Option value="buttonGroup">Dạng nhóm nút</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {(inputType === 'one' || inputType === 'multiple') && (
            <>
              <Form.Item label="Danh sách lựa chọn">
                <div className="flex gap-2 mb-3">
                  <Input 
                    placeholder='Nhập giá trị cách nhau bằng dấu ";"' 
                    value={tempOptionInput}
                    onChange={e => setTempOptionInput(e.target.value)}
                    onPressEnter={(e) => { e.preventDefault(); handleAddOptionToList(); }}
                  />
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOptionToList}>Thêm mới</Button>
                  <Button icon={<CloseOutlined />} onClick={() => setTempOptionInput('')} />
                </div>
                
                <div className="max-h-48 overflow-y-auto border rounded bg-white">
                  {addedOptions.length > 0 ? (
                    <ul className="m-0 p-0 list-none">
                      {addedOptions.map((opt, i) => (
                        <li key={i} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0 group hover:bg-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700">{opt}</span>
                          </div>
                          <Button 
                            type="text" 
                            danger 
                            size="small" 
                            icon={<CloseOutlined style={{ fontSize: 12 }} />} 
                            onClick={() => handleRemoveOptionFromList(opt)}
                            title="Xóa"
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs italic">Chưa có lựa chọn nào</div>
                  )}
                </div>
              </Form.Item>

              <Form.Item name="listPerLine" valuePropName="checked">
                <Checkbox>Dạng danh sách mỗi lựa chọn một dòng</Checkbox>
              </Form.Item>
            </>
          )}

          <div className="flex flex-col gap-2">
            <Form.Item name="active" valuePropName="checked" noStyle>
              <Checkbox>Được hoạt động</Checkbox>
            </Form.Item>
            <Form.Item name="required" valuePropName="checked" noStyle>
              <Checkbox>Bắt buộc</Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};