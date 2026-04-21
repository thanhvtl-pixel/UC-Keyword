export const SKIP = 'KHÔNG CẦN';

export interface OptionType {
  val: string;
  kw?: string;
  ex?: string;
  readonly?: boolean;
  syncStatus?: 'synced' | 'pending';
}

export interface FieldType {
  section?: string;
  id?: string;
  num?: number;
  name?: string;
  req?: boolean;
  skip?: boolean;
  system?: boolean; // true for System fields, false/undefined for Custom fields
  options?: OptionType[];
  type?: string;
}

// ============================================
// REUSABLE OPTION LISTS (Easy to customize)
// ============================================

// Đối tượng khách hàng
const CUSTOMER_TYPES: OptionType[] = [
  { val: 'Khách hàng Premium' },
  { val: 'Nội bộ UrBox' },
];

// Doanh nghiệp
const ENTERPRISES: OptionType[] = [
  { val: 'ACB' },
  { val: 'VPBank' },
  { val: 'OCB' },
  { val: 'TCB' },
  { val: 'JCB' },
  { val: 'SHB' },
  { val: 'Agribank' },
  { val: 'Prudential' },
  { val: 'Vietinbank' },
  { val: 'PVCOMBANK' },
  { val: 'Standard Chartered' },
];

// Chương trình (dùng chung cho Section 1 field 5 và Section 2 field 2)
const PROGRAMS: OptionType[] = [
  { val: 'ACB Visa Infinite' },
  { val: 'ACB Loyalty' },
  { val: 'APP UrBox' },
  { val: 'Agribank' },
  { val: 'TCB Rewards' },
  { val: 'Visa UrPoint' },
  { val: 'TCB Golf' },
  { val: 'OCB Đặc quyền kim cương' },
  { val: 'VPBank Phong vị thượng lưu 2025' },
  { val: 'VPBank LINKID' },
  { val: 'Standard Chartered 2025' },
  { val: 'JCB Premium Service' },
  ...Array.from({ length: 88 }, (_, i) => ({ val: `Chương trình Mock ${i + 13}` }))
];

// Loại dịch vụ
const SERVICE_TYPES: OptionType[] = [
  { val: 'Ẩm thực' },
  { val: 'Nghỉ dưỡng' },
  { val: 'Spa' },
  { val: 'Golf' },
  { val: 'Sức khỏe' },
  { val: 'Giải trí' },
  { val: 'Mua sắm' },
  { val: 'Khác' },
];

// Nội dung cuộc gọi
const CALL_CONTENT: OptionType[] = [
  { val: 'Call in' },
  { val: 'Call out' },
];

// Độ ưu tiên
const PRIORITY_LEVELS: OptionType[] = [
  { val: 'Khẩn cấp (04h)' },
  { val: 'Cao (24h)' },
  { val: 'Bình thường (24-48h)' },
];

// SLA (tự động theo độ ưu tiên)
const SLA_OPTIONS: OptionType[] = [
  { val: '04h' },
  { val: '24h' },
  { val: '24-48h' },
];

// Kênh sử dụng
const CHANNELS: OptionType[] = [
  { val: 'UrBox App' },
  { val: 'Phiếu quà tặng' },
  { val: 'Thẻ-link' },
  { val: 'Loyalty' },
  { val: 'Whitelabel' },
  { val: 'Manual booking' },
];

// ============================================
// PS_DATA: CS PREMIUM SERVICE
// ============================================

export const PS_DATA: FieldType[] = [
  { section: 'THÔNG TIN KHÁCH HÀNG' },
  { id: 'name', num: 1, name: 'Họ và tên', req: true, skip: true, system: true },
  { id: 'phone', num: 2, name: 'SĐT', req: true, skip: true, system: true },
  {
    id: 'doi-tuong-khach-hang',
    num: 3,
    name: 'Đối tượng Khách hàng',
    req: true,
    options: CUSTOMER_TYPES
  },
  {
    id: 'doanh-nghiep',
    num: 4,
    name: 'Doanh nghiệp',
    req: true,
    options: ENTERPRISES
  },
  {
    id: 'chuong-trinh',
    num: 5,
    name: 'Chương trình',
    req: true,
    options: PROGRAMS
  },
  { section: 'THÔNG TIN TICKET CALLIO' },
  { id: 'noi-dung-chi-tiet', num: 1, name: 'Nội dung chi tiết', req: true, skip: true },
  {
    id: 'chuong-trinh---du-an',
    num: 2,
    name: 'Chương trình, dự án',
    req: true,
    options: PROGRAMS
  },
  {
    id: 'loai-dich-vu',
    num: 3,
    name: 'Loại dịch vụ',
    req: true,
    options: SERVICE_TYPES
  },
  {
    id: 'noi-dung-cuoc-goi',
    num: 4,
    name: 'Nội dung cuộc gọi',
    req: true,
    options: CALL_CONTENT
  },
  { id: 'ma-psub', num: 5, name: 'Mã PSUB', req: true, skip: true },
  {
    id: 'do-uu-tien',
    num: 6,
    name: 'Độ ưu tiên',
    req: true,
    options: PRIORITY_LEVELS
  },
  {
    id: 'sla',
    num: 7,
    name: 'SLA',
    req: true,
    options: SLA_OPTIONS
  },
  {
    id: 'kenh-su-dung',
    num: 8,
    name: 'Kênh sử dụng',
    req: true,
    options: CHANNELS
  },
  { id: 'nguyen-nhan', num: 9, name: 'Nguyên nhân khiếu nại', req: false, skip: true },
  { id: 'nguyen-nhan-chi-tiet', num: 10, name: 'Nguyên nhân phát sinh khiếu nại', req: false, skip: true },
  { id: 'phuong-an-xu-ly', num: 11, name: 'Phương án xử lý khiếu nại', req: false, skip: true },
];

export const EG_DATA: FieldType[] = [
  { section: 'THÔNG TIN KHÁCH HÀNG' },
  { id: 'eg-1', num: 1, name: 'Họ và tên', req: true, skip: true },
  { id: 'eg-2', num: 2, name: 'SĐT', req: true, skip: true },
  {
    id: 'eg-3', num: 3, name: 'Doanh nghiệp', req: true, options: [
      { val: 'Traveloka' }, { val: 'Maison' }, { val: 'Couple Tx' }, { val: 'Routine' }, { val: 'Hoàng Phúc' },
      { val: 'Vascara' }, { val: 'Juno' }, { val: 'PNJ' }, { val: 'Canifa' }, { val: 'Owen' },
      { val: 'Gogi House' }, { val: 'Kichi Kichi' }, { val: 'Manwah' }, { val: 'Hutong' }, { val: 'Sumo Yakiniku' },
      { val: 'Isushi' }, { val: 'Ashima' }, { val: "Cowboy Jack's" }, { val: 'Daruma' }, { val: 'Shogun' },
      { val: 'Crystal Jade' }, { val: 'Phố Ngon 37' }, { val: 'K-Pub' }, { val: 'GoGi Kitchen' },
      { val: 'The Pizza Company' }, { val: 'Dairy Queen' }, { val: "Swensen's" }, { val: 'AKA' }, { val: 'Holy Crab' },
    ]
  },
  { section: 'THÔNG TIN TICKET CALLIO' },
  { id: 'eg-4', num: 4, name: 'Tên Ticket', req: true, skip: true },
  { id: 'eg-5', num: 5, name: 'Nguồn', req: false, skip: true },
  {
    id: 'eg-6', num: 6, name: 'SLA', req: true, options: [
      { val: 'Xử lý ngay trong call (FCR - 5 phút)' },
      { val: 'Xử lý trong vòng 60p (FCR < 60p)' },
      { val: '01 ngày làm việc (24 giờ)' },
      { val: '02 ngày làm việc (2 ngày)' },
      { val: '03 ngày làm việc (3 ngày)' },
      { val: '03 - 05 ngày làm việc' },
      { val: '> 05 ngày làm việc (5 ngày)' },
    ]
  },
  {
    id: 'eg-7', num: 7, name: 'Đối tượng khách hàng', req: true, options: [
      { val: 'KH cá nhân' }, { val: 'Nhân viên đối tác' }, { val: 'Khách hàng Premium' },
      { val: 'Nội bộ UrBox' }, { val: 'KH được cho/tặng' },
    ]
  },
  {
    id: 'eg-8', num: 8, name: 'Nhóm Nghiệp vụ', req: true, options: [
      { val: 'EGIFT' }, { val: 'OCR' },
    ]
  },
  {
    id: 'eg-9', num: 9, name: 'Chương trình', req: true, options: [
      { val: 'Chưa rõ' }, { val: 'Chi tiêu Visa – Săn vé Starbucks Concert' },
      { val: 'Suntory Pepsico - Aquafina' }, { val: 'OCR_Nivea' }, { val: 'OCR_Panasonic' },
      { val: 'OCR_Shiseido' }, { val: 'AIA - VpBank' }, { val: 'AIA' }, { val: 'AIA Vitality' },
      { val: 'ACB Loyalty' }, { val: 'VpBank' }, { val: 'LG' }, { val: 'MBAL' }, { val: 'Unilever' },
      ...Array.from({ length: 86 }, (_, i) => ({ val: `Chương trình EG Mock ${i + 15}` }))
    ]
  },
  {
    id: 'eg-10', num: 10, name: 'Kênh sử dụng', req: true, options: [
      { val: 'UrBox App' }, { val: 'Loyalty' }, { val: 'Whitelabel' }, { val: 'Chương trình quay thưởng' },
    ]
  },
  {
    id: 'eg-11', num: 11, name: 'Sản phẩm', req: true, options: [
      { val: 'E-voucher' }, { val: 'Phiếu quà tặng' }, { val: 'Thẻ/link quà tặng' },
      { val: 'Thẻ nạp điện thoại' }, { val: 'Quà tặng hiện vật' }, { val: 'Booking' },
    ]
  },
  { id: 'eg-12', num: 12, name: 'Mã voucher', req: true, skip: true },
  { id: 'eg-13', num: 13, name: 'Thương hiệu', req: false, skip: true },
  { id: 'eg-14', num: 14, name: 'Địa chỉ cửa hàng', req: false, skip: true },
  { id: 'eg-15', num: 15, name: 'Email', req: false, skip: true },
  {
    id: 'eg-16', num: 16, name: 'Nhóm yêu cầu', req: true, options: [
      { val: 'Tư vấn/Hỗ trợ' }, { val: 'Xử lý yêu cầu/Khiếu nại' },
    ]
  },
  {
    id: 'eg-17', num: 17, name: 'Yêu cầu', req: true, options: [
      { val: 'Tư vấn chuyển Lead' }, { val: 'Tư vấn thông diễn sản phẩm' },
      { val: 'Kiểm tra thông tin voucher/thẻ/thẻ nạp/thẻ game/quà tặng' },
      { val: 'Hướng dẫn sử dụng sản phẩm/ CT quay thưởng' },
      { val: 'Hỗ trợ đăng ký nhận quà' },
      { val: 'Tiếp nhận và xử lý yêu cầu/Khiếu nại' },
      { val: 'Xác nhận đơn quà (QVL/LG)' },
      { val: 'Thông báo nhận QVL/KQ hỗ trợ' },
      { val: 'Liên hệ nhà mạng viễn thông' },
      { val: 'Liên hệ nội bộ UrBox' },
      { val: 'Khảo sát KH' }, { val: 'Crosscheck' }, { val: 'Nguyên tắc duyệt quà' },
      { val: 'Liên hệ miss call' }, { val: 'Hỏi đáp yêu cầu/hỗ trợ trước' },
      { val: 'Tư vấn thông tin khác' },
    ]
  },
  { id: 'eg-18', num: 18, name: 'Chi tiết yêu cầu (Nguyên nhân)', req: false, skip: true },
  { id: 'eg-19', num: 19, name: 'Vấn đề cụ thể', req: false, skip: true },
  { id: 'eg-20', num: 20, name: 'Nguyên nhân chi tiết (nếu có)', req: false, skip: true },
  { id: 'eg-21', num: 21, name: 'Phương án xử lý khiếu nại (nếu có)', req: false, skip: true },
];