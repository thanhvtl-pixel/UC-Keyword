import React, { useState, useMemo } from 'react';
import { Modal, Button, Radio, Collapse, Select, Input, Tag, message } from 'antd';
import { PS_DATA, EG_DATA, FieldType, OptionType } from './data';

interface AIKeywordConfigModalProps {
  open: boolean;
  onClose: () => void;
}

type FieldState = {
  [val: string]: { kw: string[]; ex: string };
};

type AppState = {
  [fid: string]: FieldState;
};

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
  return { kw: initKws, ex: initEx };
};

const buildInitialState = (): AppState => {
  const state: AppState = {};
  [...PS_DATA, ...EG_DATA].forEach(item => {
    if (item.id && item.options) {
      state[item.id] = {};
      item.options.forEach(opt => {
        if (!opt.readonly) {
          state[item.id!][opt.val] = parseInit(opt);
        }
      });
    }
  });
  return state;
};

export const AIKeywordConfigModal: React.FC<AIKeywordConfigModalProps> = ({ open, onClose }) => {
  const [currentType, setCurrentType] = useState<'ps' | 'eg'>('ps');
  const [state, setState] = useState<AppState>(buildInitialState());
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const curData = currentType === 'ps' ? PS_DATA : EG_DATA;

  const handleStateChange = (fid: string, oval: string, type: 'kw' | 'ex', value: any) => {
    setState(prev => {
      const newState = { ...prev };
      if (!newState[fid]) newState[fid] = {};
      if (!newState[fid][oval]) newState[fid][oval] = { kw: [], ex: '' };

      newState[fid][oval] = {
        ...newState[fid][oval],
        [type]: value,
      };
      return newState;
    });
  };

  const handleReset = () => {
    if (window.confirm('Đặt lại tất cả keyword đã nhập?')) {
      setState(buildInitialState());
      message.success('Đã đặt lại');
    }
  };

  const handleSave = () => {
    message.success('✓ Đã lưu cấu hình thành công!');
    onClose();
  };

  const handleExport = () => {
    const label = currentType === 'ps' ? 'CS_PS' : 'CS_EGIFT';
    let csv = 'Field,Giá trị,Keywords,Ví dụ câu nói\n';
    curData.forEach(item => {
      if (item.section || !item.id) return;
      if (item.skip) {
        csv += `"${item.name}","(Không cần keyword)","",""\n`;
      } else if (item.options) {
        item.options.forEach(opt => {
          if (opt.readonly) return;
          const st = state[item.id!]?.[opt.val] || { kw: [], ex: '' };
          const kw = st.kw.join(', ');
          const ex = st.ex.replace(/"/g, '""');
          csv += `"${item.name}","${opt.val}","${kw}","${ex}"\n`;
        });
      }
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Keyword_Config_${label}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.info('⬇ Đang tải xuống file CSV...');
  };

  const summary = useMemo(() => {
    const fields = curData.filter(d => d.id && !d.skip && d.options);
    let done = 0;
    const need = fields.length;
    const skips = curData.filter(d => d.id && d.skip).length;
    const total = curData.filter(d => d.id).length;

    fields.forEach(f => {
      const s = state[f.id!];
      if (s && Object.values(s).some(v => v.kw.length > 0 || v.ex.trim())) {
        done++;
      }
    });

    return { total, done, need: need - done, skips };
  }, [curData, state]);

  const toggleAll = () => {
    if (expandedKeys.length > 0) {
      setExpandedKeys([]);
    } else {
      const allKeys = curData.filter(d => d.id).map(d => d.id!);
      setExpandedKeys(allKeys);
    }
  };

  const renderFieldBody = (item: FieldType) => {
    if (item.skip) {
      return (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-xs italic flex items-center gap-2">
          <span className="text-lg">ℹ</span>
          Không cần keyword – AI tự nhận diện hoặc trích xuất trực tiếp từ transcript
        </div>
      );
    }

    if (!item.options) return null;

    return (
      <div className="bg-white">
        <div className="grid grid-cols-[200px_1fr_1fr] gap-0 bg-[#f0f5ff] px-4 py-2 border-y border-slate-200">
          <span className="text-[11px] text-[#3b5bdb] font-semibold">Giá trị (Dropdown)</span>
          <span className="text-[11px] text-[#3b5bdb] font-semibold">
            Keywords <small className="font-normal opacity-70">— gõ rồi nhấn Enter</small>
          </span>
          <span className="text-[11px] text-[#3b5bdb] font-semibold">Ví dụ câu nói thực tế</span>
        </div>
        <OptionsList item={item} state={state} onStateChange={handleStateChange} />
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1100}
      title={null}
      closable={false}
      style={{ top: 20, fontFamily: 'Inter, sans-serif' }}
      styles={{ body: { padding: 0, overflow: 'hidden', borderRadius: '8px' } }}
      wrapClassName="font-sans"
    >
      <div className="flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 m-0">AI Keyword Configuration</h2>
            <p className="text-sm text-slate-500 mt-1 mb-0">Điền keyword & ví dụ câu nói để AI nhận diện đúng từng field trong transcript cuộc gọi</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={toggleAll}>{expandedKeys.length ? 'Thu gọn tất cả' : 'Mở tất cả'}</Button>
            <Button onClick={handleExport} className="bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white border-none">
              Xuất Excel
            </Button>
            <Button type="primary" onClick={handleSave}>
              Lưu
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#f4f6f9]">
          {/* Type Switcher */}
          <div className="mb-5">
            <Radio.Group
              value={currentType}
              onChange={e => setCurrentType(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="ps" className="px-6">CS Premium Service (CS PS) <Tag className="ml-2 text-[10px]" color={currentType === 'ps' ? 'blue' : 'default'}>16 fields</Tag></Radio.Button>
              <Radio.Button value="eg" className="px-6">CS eGift / OCR <Tag className="ml-2 text-[10px]" color={currentType === 'eg' ? 'blue' : 'default'}>21 fields</Tag></Radio.Button>
            </Radio.Group>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600 leading-none">{summary.total}</div>
              <div className="text-xs text-slate-500 mt-1">Tổng fields</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-emerald-600 leading-none">{summary.done}</div>
              <div className="text-xs text-slate-500 mt-1">Đã có keyword</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-600 leading-none">{summary.need}</div>
              <div className="text-xs text-slate-500 mt-1">Cần điền</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-slate-400 leading-none">{summary.skips}</div>
              <div className="text-xs text-slate-500 mt-1">Không cần keyword</div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4 pb-12">
            {curData.map((item, idx) => {
              if (item.section) {
                return (
                  <div key={`sec-${idx}`} className="bg-gradient-to-r from-[#0f1c2e] to-[#1e3a5f] text-white px-4 py-2 rounded-t-lg text-xs font-semibold uppercase tracking-wide mt-6">
                    {item.section}
                  </div>
                );
              }

              const fieldState = state[item.id!];
              const vals = fieldState ? Object.values(fieldState) : [];
              const filled = vals.filter(v => v.kw.length > 0 || v.ex.trim()).length;
              const total = vals.length;

              let statusNode = null;
              if (item.skip) {
                statusNode = <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">Tự động</span>;
              } else if (filled === 0) {
                statusNode = <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 shrink-0">Chưa điền</span>;
              } else if (filled < total) {
                statusNode = <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 shrink-0">{filled}/{total} options</span>;
              } else {
                statusNode = <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">Đã điền đủ</span>;
              }

              const header = (
                <div className="flex items-center gap-3 w-full">
                  <span className="text-[11px] text-slate-500 font-semibold min-w-[18px]">{item.num}</span>
                  <span className="text-[13px] font-semibold text-slate-900 flex-1">{item.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${item.req ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                    {item.req ? 'Bắt buộc' : 'Không bắt buộc'}
                  </span>
                  <span className="text-[11px] text-slate-500 shrink-0 w-24 text-right">
                    {item.skip ? 'Không cần keyword' : `${item.options?.length} options`}
                  </span>
                  {statusNode}
                </div>
              );

              return (
                <Collapse
                  key={item.id}
                  activeKey={expandedKeys.includes(item.id!) ? [item.id!] : []}
                  onChange={(keys) => {
                    const isActive = keys.length > 0;
                    setExpandedKeys(prev =>
                      isActive
                        ? [...prev, item.id!]
                        : prev.filter(k => k !== item.id!)
                    );
                  }}
                  className="bg-white border border-slate-200 shadow-sm rounded-none first:rounded-t-md last:rounded-b-md -mt-px relative"
                  expandIconPlacement="start"
                  items={[
                    {
                      key: item.id!,
                      label: header,
                      children: renderFieldBody(item),
                      className: "p-0",
                      style: { borderBottom: 'none' }
                    }
                  ]}
                />
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-4 px-6 flex items-center justify-between shrink-0 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] z-10">
          
          <div className="flex gap-2">
            <Button onClick={handleReset}>Đặt lại</Button>
            <Button onClick={handleExport} className="bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white border-none">
              Xuất Excel
            </Button>
            <Button type="primary" onClick={handleSave}>
              Lưu cấu hình
            </Button>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const OptionsList: React.FC<{
  item: FieldType;
  state: AppState;
  onStateChange: (fid: string, oval: string, type: 'kw' | 'ex', value: any) => void;
}> = ({ item, state, onStateChange }) => {
  const [showMore, setShowMore] = useState(false);
  const options = item.options || [];

  const visibleOptions = showMore ? options : options.slice(0, 8);
  const hasHidden = options.length > 8;

  return (
    <div>
      {visibleOptions.map((opt, i) => {
        if (opt.readonly) {
          return (
            <div key={i} className="grid grid-cols-[200px_1fr_1fr] gap-3 px-4 py-2.5 border-b border-slate-200 items-start bg-slate-50">
              <div className="text-[11px] text-slate-500 italic">{opt.val}</div>
              <div></div>
              <div></div>
            </div>
          );
        }

        const s = state[item.id!]?.[opt.val] || { kw: [], ex: '' };

        return (
          <div key={i} className={`grid grid-cols-[200px_1fr_1fr] gap-3 px-4 py-2.5 border-b border-slate-200 items-start hover:bg-blue-50 transition-colors ${i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}>
            <div className="text-xs font-semibold text-slate-800 pt-1 leading-snug break-words">
              {opt.val}
            </div>
            <div>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Thêm keyword..."
                value={s.kw}
                onChange={(val) => onStateChange(item.id!, opt.val, 'kw', val)}
                className="text-xs w-full"
                open={false}
                tokenSeparators={[',']}
              />
            </div>
            <div>
              <Input.TextArea
                value={s.ex}
                onChange={(e) => onStateChange(item.id!, opt.val, 'ex', e.target.value)}
                placeholder='"VD: câu KH thường nói trong cuộc gọi..."'
                autoSize={{ minRows: 2, maxRows: 4 }}
                className="text-xs rounded-md"
              />
            </div>
          </div>
        );
      })}

      {hasHidden && (
        <div
          className="px-4 py-2 border-t border-slate-200 cursor-pointer text-blue-600 text-xs font-medium bg-blue-50 hover:bg-blue-100 flex items-center transition-colors"
          onClick={() => setShowMore(!showMore)}
        >
          <span className="mr-1">{showMore ? '▾' : '▸'}</span>
          {showMore ? 'Thu gọn' : `Hiện thêm ${options.length - 8} options`}
        </div>
      )}
    </div>
  );
};