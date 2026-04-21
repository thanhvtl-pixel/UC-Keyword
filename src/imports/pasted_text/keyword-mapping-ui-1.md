
      1 # TASK: Build UI "Quản lý Keyword Mapping Callio" - 2 Screens
      2 
      3 ## BỐI CẢNH
      4 CS đang quản lý keyword mapping bằng Excel. Muốn thay bằng UI web gồm 2 màn hình.
      5 
      6 ---
      7 
      8 ## TECH STACK
      9 - Next.js (React), TypeScript
     10 - Tailwind CSS hoặc Ant Design
     11 - Router: Next.js App Router
     12 
     13 ---
     14 
     15 ## SCREEN 1: Danh sách Fields
    ┌─────────────────────────────────────────────────────────────────┐
    │  QUẢN LÝ KEYWORD MAPPING CHO AI                                 │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                 │
    │  DANH SÁCH CALLIO FIELDS                                        │
    │                                                                 │
    │  ┌───────────────────────────────────────────────────────────┐ │
    │  │ Field              │ Số options │ Keywords tổng  │ Status  │
    │  ├────────────────────┼────────────┼────────────────┼─────────┤
    │  │                                                            │
    │  │  🍽️ Loại dịch vụ   │     10     │      45        │ ✅ Active│
    │  │     (Ẩm thực, Golf, Spa...)                                │
    │  │                                    [→ Xem & Edit Keywords] │
    │  ├───────────────────────────────────────────────────────────┤ │
    │  │                                                            │
    │  │  🎯 Độ ưu tiên      │      4     │      18        │ ✅ Active│
    │  │     (04h-KH bực tức, 24h-Cao...)                           │
    │  │                                    [→ Xem & Edit Keywords] │
    │  ├───────────────────────────────────────────────────────────┤ │
    │  │                                                            │
    │  │  📋 Chương trình    │     15     │      62        │ ✅ Active│
    │  │     (ACB Visa Infinite, JCB Premium...)                    │
    │  │                                    [→ Xem & Edit Keywords] │
    │  ├───────────────────────────────────────────────────────────┤ │
    │  │                                                            │
    │  │  📱 Kênh sử dụng    │      6     │      24        │ ✅ Active│
    │  │     (UrBox App, Phiếu quà tặng...)                         │
    │  │                                    [→ Xem & Edit Keywords] │
    │  ├───────────────────────────────────────────────────────────┤ │
    │  │                                                            │
    │  │  ⚠️ Nguyên nhân KN  │      5     │      15        │ ✅ Active│
    │  │     (Do hệ thống, Do đối tác...)                           │
    │  │                                    [→ Xem & Edit Keywords] │
    │  ├───────────────────────────────────────────────────────────┤ │
    │  │                                                            │
    │  │  🏢 Doanh nghiệp    │     11     │      38        │ ✅ Active│
    │  │     (ACB, VPBank, JCB...)                                  │
    │  │                                    [→ Xem & Edit Keywords] │
    │  ├───────────────────────────────────────────────────────────┤ │
    │  │                                                            │
    │  │  👤 Đối tượng KH    │      2     │       8        │ ✅ Active│
    │  │     (Premium, Nội bộ)                                      │
    │  │                                    [→ Xem & Edit Keywords] │
    │  └───────────────────────────────────────────────────────────┘ │
    │                                                                 │
    │  Tổng: 7 fields | 53 options | 210 keywords                    │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

     1 
     2 **Click vào [→ Xem & Edit Keywords] hoặc click vào row** → Chuyển sang Screen 2
     3 
     4 ---
     5 
     6 ## SCREEN 2: Chi tiết Options của Field được chọn
     7 
     8 Ví dụ: Click vào "Loại dịch vụ" (10 options)
    ┌──────────────────────────────────────────────────────────────────────────────────┐
    │  ← Quay lại danh sách Field                                                     │
    │                                                                                   │
    │  🍽️ LOẠI DỊCH VỤ (10 options)                               [+ Thêm option]      │
    ├───────────────────────────────────────────────────────────────────────────────────┤
    │                                                                                   │
    │  ┌─────────┬──────────────────┬──────────────────────────┬──────────────────┐     │
    │  │ #       │ Option           │ Keywords                  │ Ví dụ kịch bản   │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │         │                  │                          │                  │     │
    │  │ 1       │ Ẩm thực          │ [nhà hàng x] [ăn uống x] │ [KH muốn đặt    │     │
    │  │         │                  │ [đặt bàn x] [restaurant x]│  nhà hàng...]   │     │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │ [+ Thêm dòng ví dụ]│  │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │  [💾 Save] [🗑️] │     │
    │  │         │                  │                          │                  │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │         │                  │                          │                  │     │
    │  │ 2       │ Nghỉ dưỡng       │ [khách sạn x] [resort x] │ [KH hỏi đặt     │     │
    │  │         │                  │ [đặt phòng x] [hotel x]  │  khách sạn...]  │     │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │ [+ Thêm dòng ví dụ]│  │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │  [💾 Save] [🗑️] │     │
    │  │         │                  │                          │                  │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │         │                  │                          │                  │     │
    │  │ 3       │ Golf             │ [golf x] [sân golf x]    │ [Em muốn đặt    │     │
    │  │         │                  │ [đánh golf x] [tee x]    │  sân golf...]   │     │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │ [+ Thêm dòng ví dụ]│  │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │  [💾 Save] [🗑️] │     │
    │  │         │                  │                          │                  │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │ 4       │ Spa              │ [spa x] [massage x]      │ [Chị muốn đặt   │     │
    │  │         │                  │ [chăm sóc da x]          │  spa gần Q1...] │     │
    │  │         │                  │                          │                  │     │
    │  │         │                  │                          │  [💾 Save] [🗑️] │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │ 5       │ Sức khỏe         │ [bệnh viện x] [khám x]   │ [Anh muốn khám  │     │
    │  │         │                  │ [tiêm ngừa x]            │  tổng quát...]  │     │
    │  │         │                  │                          │  [💾 Save] [🗑️] │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │ 6       │ Giải trí         │ [karaoke x] [phim x]     │ [Cho em đặt     │     │
    │  │         │                  │ [vui chơi x]             │  karaoke...]    │     │
    │  │         │                  │                          │  [💾 Save] [🗑️] │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │ 7       │ Mua sắm          │ [siêu thị x] [shopping x]│ [Em muốn mua    │     │
    │  │         │                  │ [mua đồ x]               │  quà...]        │     │
    │  │         │                  │                          │  [💾 Save] [🗑️] │     │
    │  ├─────────┼──────────────────┼──────────────────────────┼──────────────────┤     │
    │  │ 8       │ ...              │ ...                      │ ...             │     │
    │  │ 9       │ ...              │ ...                      │ ...             │     │
    │  │ 10      │ ...              │ ...                      │ ...             │     │
    │  └─────────┴──────────────────┴──────────────────────────┴──────────────────┘     │
    │                                                                                   │
    │  [+ Thêm option]  [Lưu tất cả]  [Quay lại]                                       │
    │                                                                                   │
    └───────────────────────────────────────────────────────────────────────────────────┘

     1 
     2 ---
     3 
     4 ## INTERACTION FLOW
    Screen 1: Danh sách Fields
        ↓ User click vào "Loại dịch vụ"
        ↓
    Screen 2: Hiện thị 10 options của "Loại dịch vụ"
        ↓
    Mỗi option có:
       - Option name (label)
       - Keywords input (tags, nhấn Enter để add)
       - Ví dụ kịch bản (textarea, thêm nhiều dòng)
       - Nút [💾 Save] [🗑️ Delete]
        ↓
    User bấm [+ Thêm option] → Thêm row trống
        ↓
    User nhập keywords → Bấm Save → Row chuyển sang read-only

     1 
     2 ---
     3 
     4 ## DATA STRUCTURE
    // 1 Field (VD: Loại dịch vụ)
    interface CallioField {
      fieldKey: string;         // "service_type"
      fieldLabel: string;       // "Loại dịch vụ"
      icon?: string;            // "🍽️"
      options: KeywordOption[];
      isActive: boolean;
    }

    // 1 Option của Field (VD: Ẩm thực)
    interface KeywordOption {
      id?: string;
      optionValue: string;      // "Ẩm thực"
      keywords: string[];       // ["nhà hàng", "ăn uống", "đặt bàn"]
      exampleScripts: string[]; // ["KH muốn đặt nhà hàng...", ...]
      notes?: string;
      createdAt?: string;
      updatedAt?: string;
    }