import React, { useState, useRef } from 'react';
import { Button, Select, Input, message, Table, Space, Tag } from 'antd';
import { EditOutlined, SaveOutlined, SearchOutlined, CloudUploadOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { InputRef } from 'antd';
import { FieldType, OptionType } from './data';

const { TextArea } = Input;

interface FieldDetailScreenProps {
  field: FieldType;
  onBack: () => void;
}

type SyncStatus = 'synced' | 'pending' | 'modified';

interface OptionState {
  id: string; // Thêm ID ổn định cho rowKey
  optionValue: string;
  keywords: string[];
  exampleScripts: string[];
  isEditing: boolean;
  syncStatus?: SyncStatus;
}

const parseInit = (opt: OptionType) => {
  const initKws = (opt.kw || '')
    .replace(/^\[Mẫu\]\s*/, '')
    .split(',')
    .map(s => s.trim())
    .filter(s => s && s !== 'Nhờ CS input giúp em');

  const initEx = (opt.ex || '')
    .replace(/^\[Mẫu\]\n?/, '')
    .replace(/Nhờ CS input giúp em/g, '')
    .trim();

  const examples = initEx ? initEx.split('\n').filter(e => e.trim()) : [];

  return { kw: initKws, ex: examples };
};

export const FieldDetailScreen: React.FC<FieldDetailScreenProps> = ({ field, onBack }) => {
  // Check if this is "Chương trình" field for special sync logic
  const isProgramField = field.id === 'chuong-trinh' || field.id === 'chuong-trinh---du-an';
  
  const initialOptions: OptionState[] = (field.options || [])
    .filter(opt => !opt.readonly)
    .map((opt, idx) => {
      const parsed = parseInit(opt);
      return {
        id: `opt-${idx}-${Date.now()}`,
        optionValue: opt.val,
        keywords: parsed.kw,
        exampleScripts: parsed.ex,
        isEditing: false,
        syncStatus: (opt as any).syncStatus || 'synced' // Lấy syncStatus từ data nếu có
      };
    });

  const [options, setOptions] = useState<OptionState[]>(initialOptions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const searchInput = useRef<InputRef>(null);

  const handleKeywordsChange = (index: number, keywords: string[]) => {
    const newOptions = [...options];
    newOptions[index].keywords = keywords;
    setOptions(newOptions);
  };

  const handleOptionNameChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].optionValue = value;
    setOptions(newOptions);
  };

  const handleAddExample = (index: number) => {
    const newOptions = [...options];
    newOptions[index].exampleScripts.push('');
    setOptions(newOptions);
  };

  const handleExampleChange = (optionIndex: number, exampleIndex: number, value: string) => {
    const newOptions = [...options];
    newOptions[optionIndex].exampleScripts[exampleIndex] = value;
    setOptions(newOptions);
  };

  const handleRemoveExample = (optionIndex: number, exampleIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].exampleScripts.splice(exampleIndex, 1);
    setOptions(newOptions);
  };

  const handleSave = (index: number, silent = false) => {
    const option = options[index];
    if (!option.optionValue.trim()) {
      if (!silent) message.error('Vui lòng nhập tên option');
      return;
    }
    if (option.keywords.length === 0) {
      if (!silent) message.error('Vui lòng thêm ít nhất 1 keyword');
      return;
    }

    const newOptions = [...options];
    newOptions[index].isEditing = false;
    setOptions(newOptions);
    setEditingIndex(null);
    if (!silent) message.success('Đã lưu option');
  };

  const handleSyncToCallio = async (index: number) => {
    const option = options[index];
    
    message.loading({ content: 'Đang đồng bộ lên Callio...', key: 'sync' });
    
    // Simulate API call to Callio
    setTimeout(() => {
      const newOptions = [...options];
      newOptions[index].isEditing = false;
      newOptions[index].syncStatus = 'synced';
      setOptions(newOptions);
      setEditingIndex(null);
      
      message.success({ 
        content: `Đã đồng bộ "${option.optionValue}" lên Callio thành công!`, 
        key: 'sync',
        duration: 3
      });
    }, 1500);
  };

  const handleSyncAll = async () => {
    const newOptionsOnly = options.filter(opt => opt.syncStatus === 'pending');
    
    if (newOptionsOnly.length === 0) {
      message.info('Không có option mới nào cần đồng bộ lên Callio');
      return;
    }

    message.loading({ content: `Đang đồng bộ ${newOptionsOnly.length} option mới lên Callio...`, key: 'syncAll' });
    
    // Simulate batch API call
    setTimeout(() => {
      const newOptions = options.map(opt => ({
        ...opt,
        syncStatus: opt.syncStatus === 'pending' ? 'synced' : opt.syncStatus
      }));
      setOptions(newOptions as OptionState[]);
      
      message.success({ 
        content: `Đã đồng bộ ${newOptionsOnly.length} option mới lên Callio thành công!`, 
        key: 'syncAll',
        duration: 3
      });
    }, 2000);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const newOptions = [...options];
    newOptions[index].isEditing = true;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    const newOption: OptionState = {
      id: `new-${Date.now()}`, // Tạo ID ổn định cho option mới
      optionValue: '',
      keywords: [],
      exampleScripts: [''],
      isEditing: true,
      syncStatus: 'pending'
    };
    
    setOptions([newOption, ...options]);
    setEditingIndex(0);
    setPagination({ ...pagination, current: 1 }); // Quay về trang 1 để thấy option mới
  };

  const handleSaveAll = () => {
    // Check if any option is still being edited
    if (options.some(opt => opt.isEditing)) {
      message.warning('Vui lòng lưu các option đang chỉnh sửa trước');
      return;
    }
    message.success('Đã lưu tất cả thay đổi');
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

  const getColumnSearchProps = (dataIndex: keyof OptionState, placeholder: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={placeholder}
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
    onFilter: (value: any, record: OptionState) => {
      const fieldValue = record[dataIndex];
      if (Array.isArray(fieldValue)) {
        return fieldValue.some(item =>
          item.toString().toLowerCase().includes((value as string).toLowerCase())
        );
      }
      return fieldValue
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      fixed: 'left' as const,
      render: (_: any, __: any, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: 'Option',
      dataIndex: 'optionValue',
      key: 'optionValue',
      width: 250,
      fixed: 'left' as const,
      ...getColumnSearchProps('optionValue', 'Tìm option...'),
      render: (value: string, record: OptionState, index: number) => {
        if (record.isEditing) {
          const isNew = record.id.startsWith('new-');
          return (
            <Input 
              value={value} 
              onChange={(e) => handleOptionNameChange(index, e.target.value)}
              placeholder="Nhập tên option..."
              className="font-semibold"
              disabled={!isNew} // Chỉ cho phép nhập nếu là option mới
              variant={isNew ? 'outlined' : 'filled'}
            />
          );
        }
        return <span className="font-semibold">{value}</span>;
      }
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      width: 350,
      ...getColumnSearchProps('keywords', 'Tìm keyword...'),
      render: (keywords: string[], record: OptionState, index: number) => {
        if (record.isEditing) {
          return (
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Nhấn Enter để thêm keyword..."
              value={keywords}
              onChange={(val) => handleKeywordsChange(index, val)}
              open={false}
              tokenSeparators={[',']}
              autoFocus
            />
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs border border-blue-300"
              >
                {kw}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Ví dụ kịch bản',
      dataIndex: 'exampleScripts',
      key: 'exampleScripts',
      width: 400,
      ...getColumnSearchProps('exampleScripts', 'Tìm ví dụ...'),
      render: (examples: string[], record: OptionState, index: number) => {
        if (record.isEditing) {
          return (
            <div className="space-y-2">
              {examples.map((ex, exIndex) => (
                <div key={exIndex} className="flex gap-2">
                  <TextArea
                    value={ex}
                    onChange={(e) => handleExampleChange(index, exIndex, e.target.value)}
                    placeholder="VD: Em muốn đặt..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    className="text-xs"
                  />
                  {examples.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      onMouseDown={(e) => e.preventDefault()} // Ngăn mất focus hàng
                      onClick={() => handleRemoveExample(index, exIndex)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                size="small"
                onMouseDown={(e) => e.preventDefault()} // Ngăn mất focus hàng
                onClick={() => handleAddExample(index)}
                block
              >
                + Thêm dòng ví dụ
              </Button>
            </div>
          );
        }
        return (
          <div className="space-y-1">
            {examples.map((ex, i) => (
              <div key={i} className="text-xs text-slate-600 italic">
                {ex}
              </div>
            ))}
          </div>
        );
        }
        },
        {
        title: 'Trạng thái đồng bộ',
        key: 'syncStatus',
        width: 180,
        align: 'center' as const,
        render: (_: any, record: OptionState) => {
          if (record.syncStatus === 'synced') {
            return <Tag color="green">Synced</Tag>;
          }
          if (record.syncStatus === 'pending') {
            return <Tag color="gold">New</Tag>;
          }
          return null;
        }        },
        {
        title: 'Actions',
        key: 'actions',
        width: 100,
        fixed: 'right' as const,
        align: 'center' as const,
        render: (_: any, record: OptionState, index: number) => {
        if (record.isEditing) {
          return (
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSave(index)}
              style={{ background: '#2db7f5', borderColor: '#2db7f5' }}
            />
          );
        }

        // Only show sync button for NEW options that haven't been pushed to Callio
        if (record.syncStatus === 'pending') {
          return (
            <Space>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(index)}
                style={{ color: '#2db7f5' }}
              />
              <Button
                type="text"
                size="small"
                icon={<CloudUploadOutlined style={{ color: '#faad14' }} />}
                onClick={() => handleSyncToCallio(index)}
                title="Đồng bộ lên Callio"
              />
            </Space>
          );
        }

        return (
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(index)}
            style={{ color: '#2db7f5' }}
          />
        );        }
        }
        ];

        return (
        <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="p-6 bg-white shrink-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Button
          type="text"
          onClick={onBack}
          className="mb-3"
          style={{ color: '#2db7f5' }}
        >
          ← Quay lại danh sách Field
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold m-0" style={{ color: '#001529' }}>
              {field.name} ({options.length} options)
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8c8c8c' }}>
              Quản lý keywords và ví dụ kịch bản cho từng option • Đồng bộ với Callio Custom Field
            </p>
          </div>
          <Space>
            {!isProgramField && (
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={handleAddOption}
                style={{ color: '#2db7f5', borderColor: '#2db7f5' }}
              >
                Thêm Option
              </Button>
            )}
            <Button 
              type="primary" 
              icon={<CloudUploadOutlined />}
              onClick={handleSyncAll}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Đồng bộ tất cả các thay đổi
            </Button>
          </Space>
        </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ background: '#eff0f9' }}>
        <div className="bg-white rounded shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
          <Table
            columns={columns}
            dataSource={options}
            rowKey={(record) => record.id}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} options`,
              position: ['bottomRight']
            }}
            onChange={(p) => setPagination({ current: p.current || 1, pageSize: p.pageSize || 10 })}
            onRow={(record, index) => ({
              onBlur: (e) => {
                // Kiểm tra xem focus mới có nằm ngoài hàng này không
                const nextFocus = e.relatedTarget as HTMLElement;
                const rowElement = e.currentTarget as HTMLElement;
                if (index !== undefined && !rowElement.contains(nextFocus)) {
                  handleSave(index, true); // true = silent save
                }
              }
            })}
            bordered
            scroll={{ x: 1600 }}
          />
        </div>
        </div>
        </div>
        );
        };