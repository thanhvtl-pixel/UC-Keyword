      1 # TASK: Build Manual Mapping UI - Trường "Chương trình" (URCARD ↔ Callio)
      2 
      3 ## BỐI CẢNH
      4 - URCARD Portal có danh sách Campaigns
      5 - Callio có field "Chương trình" (dropdown)
      6 - CS muốn **thủ công map** 1 campaign từ URCARD → 1 option trong Callio dropdown
      7 
      8 ---
      9 
     10 ## TECH STACK
     11 - Next.js (React), TypeScript
     12 - Tailwind CSS hoặc Ant Design
     13 - Form: React Hook Form
     14 
     15 ---
     16 
     17 ## UI FLOW
    Screen 1: Danh sách Fields
        ↓ Click vào field "📋 Chương trình"
        ↓
    Screen 2: Manual Mapping Table
        ↓ User bấm [+ Map thủ công]
        ↓
    Modal: Chọn Campaign URCARD + Nhập Callio Program name
        ↓
    Save → Thêm vào Mapping Table

     1 
     2 ---
     3 
     4 ## SCREEN 1: Danh sách Fields
    ┌─────────────────────────────────────────────────────────────┐
    │  QUẢN LÝ KEYWORD MAPPING CHO AI                             │
    ├─────────────────────────────────────────────────────────────┤
    │                                                             │
    │  DANH SÁCH CALLIO FIELDS                                    │
    │                                                             │
    │  ┌───────────────────────────────────────────────────────┐ │
    │  │ 🍽️ Loại dịch vụ      │ 10 options │ 45 keywords      │ │
    │  │    [→ Edit]                                           │ │
    │  ├───────────────────────────────────────────────────────┤ │
    │  │ 📋 Chương trình       │ 15 options │ 62 keywords      │ │
    │  │    [→ Edit]  ⚡ Có mapping                            │ │
    │  ├───────────────────────────────────────────────────────┤ │
    │  │ 🎯 Độ ưu tiên         │  4 options │ 18 keywords      │ │
    │  │    [→ Edit]                                           │ │
    │  ├───────────────────────────────────────────────────────┤ │
    │  │ 📱 Kênh sử dụng       │  6 options │ 24 keywords      │ │
    │  │    [→ Edit]                                           │ │
    │  └───────────────────────────────────────────────────────┘ │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘

     1 
     2 Click **[→ Edit]** ở "📋 Chương trình" → Screen 2
     3 
     4 ---
     5 
     6 ## SCREEN 2: Manual Mapping Table
    ┌──────────────────────────────────────────────────────────────────────────┐
    │  ← Quay lại                                                             │
    │                                                                           │
    │  📋 CHƯƠNG TRÌNH - MANUAL MAPPING                   [+ Map thủ công]     │
    ├──────────────────────────────────────────────────────────────────────────┤
    │                                                                          │
    │  ┌──────┬──────────────────────────┬──────────────────────┬────────────┐ │
    │  │ #    │ Campaign (URCARD Portal) │ Callio Program       │ Actions    │ │
    │  │      │ Code   │ Name            │ (Tên hiển thị ticket)│            │ │
    │  ├──────┼────────┼─────────────────┼──────────────────────┼────────────┤ │
    │  │      │        │                 │                      │            │ │
    │  │ 1    │ ACB-VIS│ ACB Visa        │ ACB Visa Infinite    │ [✏️][🗑️]  │ │
    │  │      │        │ Infinite        │                      │            │ │
    │  ├──────┼────────┼─────────────────┼──────────────────────┼────────────┤ │
    │  │      │        │                 │                      │            │ │
    │  │ 2    │ JCB-PRM│ JCB Premium     │ JCB Premium Service  │ [✏️][🗑️]  │ │
    │  │      │        │ Service         │                      │            │ │
    │  ├──────┼────────┼─────────────────┼──────────────────────┼────────────┤ │
    │  │      │        │                 │                      │            │ │
    │  │ 3    │ VPB-PVL│ VPBank Phong    │ VPBank Phong vị      │ [✏️][🗑️]  │ │
    │  │      │        │ Vị Thượng Lưu   │ thượng lưu 2025      │            │ │
    │  ├──────┼────────┼─────────────────┼──────────────────────┼────────────┤ │
    │  │      │        │                 │                      │            │ │
    │  │ 4    │ TCB-GOLF│ TCB Golf       │ TCB Golf             │ [✏️][🗑️]  │ │
    │  ├──────┼────────┼─────────────────┼──────────────────────┼────────────┤ │
    │  │      │        │                 │                      │            │ │
    │  │ 5    │ AGR-LOY│ Agribank        │ Agribank Loyalty     │ [✏️][🗑️]  │ │
    │  │      │        │ Loyalty         │                      │            │ │
    │  ├──────┼────────┼─────────────────┼──────────────────────┼────────────┤ │
    │  │ 6    │ ...    │ ...             │ ...                  │ [✏️][🗑️]  │ │
    │  └──────┴────────┴─────────────────┴──────────────────────┴────────────┘ │
    │                                                                          │
    │  Tổng: 15 mappings                                                       │
    │                                                                          │
    │  [+ Map thủ công]  [Export Excel]  [Quay lại]                           │
    │                                                                          │
    └──────────────────────────────────────────────────────────────────────────┘

     1 
     2 ---
     3 
     4 ## MODAL: Map thủ công (Create/Edit)
    ┌──────────────────────────────────────────────────────────────┐
    │  MAP CAMPAIGN THỦ CÔNG                             [✕ Đóng]   │
    ├──────────────────────────────────────────────────────────────┤
    │                                                              │
    │  Bước 1: Chọn Campaign từ URCARD Portal                     │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ 🔍 Tìm campaign (code hoặc tên)...                     │ │
    │  │                                                        │ │
    │  │ ┌────────────────────────────────────────────────────┐│ │
    │  │ │ [x] ACB-VIS      │ ACB Visa Infinite   │ ACB      ││ │
    │  │ │ [ ] JCB-PRM      │ JCB Premium Service │ JCB      ││ │
    │  │ │ [ ] VPB-PVL      │ VPBank Phong Vị     │ VPBank   ││ │
    │  │ │ [ ] TCB-GOLF     │ TCB Golf            │ TCB      ││ │
    │  │ │ [ ] AGR-LOY      │ Agribank Loyalty    │ Agribank ││ │
    │  │ │ [ ] SHB-WORLD    │ SHB MasterCard World│ SHB      ││ │
    │  │ │ ...                                                  ││ │
    │  │ └────────────────────────────────────────────────────┘│ │
    │  │                                                        │ │
    │  │ Showing 1-6 of 15 campaigns                            │ │
    │  └────────────────────────────────────────────────────────┘ │
    │                                                              │
    │  Bước 2: Nhập tên hiển thị trên Callio                     │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ Tên Callio Program*                                    │ │
    │  │ [ACB Visa Infinite                              ]      │ │
    │  │                                                        │ │
    │  │ ⚠️ Tên này sẽ hiện trong dropdown ticket Callio       │ │
    │  └────────────────────────────────────────────────────────┘ │
    │                                                              │
    │  Bước 3: Keywords cho AI nhận diện                         │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ Keywords (nhấn Enter để thêm)                          │ │
    │  │ ┌────────────────────────────────────────────────────┐│ │
    │  │ │ [visa infinite x] [acb infinite x] [thẻ vô cực x] ││ │
    │  │ │ [acb visa x]                                       ││ │
    │  │ │                                                     ││ │
    │  │ └────────────────────────────────────────────────────┘│ │
    │  │ 4 keywords                                             │ │
    │  └────────────────────────────────────────────────────────┘ │
    │                                                              │
    │  Bước 4: Ví dụ kịch bản (transcript mẫu)                   │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ Nhập ví dụ transcript thật để AI học pattern           │ │
    │  │                                                        │ │
    │  │ ┌────────────────────────────────────────────────────┐│ │
    │  │ │ 1. "Tôi gọi về chương trình Visa Infinite để..."   ││ │
    │  │ │                                                    ││ │
    │  │ │ 2. "Cho em hỏi về quyền lợi thẻ vô cực ACB..."     ││ │
    │  │ │                                                    ││ │
    │  │ │ [+ Thêm dòng ví dụ]                                ││ │
    │  │ └────────────────────────────────────────────────────┘│ │
    │  │ 2 examples                                             │ │
    │  └────────────────────────────────────────────────────────┘ │
    │                                                              │
    │  ┌──────────────────────────────────────────────────────────┐│
    │  │                    [Hủy]  [Lưu Mapping]                  ││
    │  └──────────────────────────────────────────────────────────┘│
    │                                                              │
    └──────────────────────────────────────────────────────────────┘
