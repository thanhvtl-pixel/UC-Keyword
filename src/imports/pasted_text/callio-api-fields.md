STT        │ Tên Field   │ Key API (Callio)     │ Loại Field │ Giá trị (Dropdown)       │ Ghi chú (Dành cho Dev & AI)       │
  │            │ (Nghiệp vụ) │                      │            │                          │                                   │
  ├────────────┼─────────────┼──────────────────────┼────────────┼──────────────────────────┼───────────────────────────────────┤
  │ THÔNG TIN  │             │                      │            │                          │                                   │
  │ KHÁCH HÀNG │             │                      │            │                          │                                   │
  │ 1          │ Họ và tên   │ name                 │ Default    │ KHÔNG CẦN                │ Nằm trong populatedCustomer.name  │
  │            │             │                      │ (System)   │                          │                                   │
  │ 2          │ SĐT         │ phone                │ Default    │ KHÔNG CẦN                │ Nằm trong populatedCustomer.phone │
  │            │             │                      │ (System)   │                          │                                   │
  │ 3          │ Đối tượng   │ doi-tuong-khach-hang │ Custom     │ Khách hàng Premium / Nội │ Nằm trong                         │
  │            │ Khách hàng  │                      │            │ bộ UrBox                 │ populatedCustomer.customFields    │
  │ 4          │ Doanh       │ doanh-nghiep         │ Custom     │ ACB, VPBank, OCB, TCB... │ Nằm trong                         │
  │            │ nghiệp      │                      │            │                          │ populatedCustomer.customFields    │
  │ 5          │ Chương      │ chuong-trinh         │ Custom     │ Option (Lấy từ chuẩn UC  │ Nằm trong                         │
  │            │ trình       │                      │            │ Portal)                  │ populatedCustomer.customFields    │
  │ THÔNG TIN  │             │                      │            │                          │                                   │
  │ TICKET     │             │                      │            │                          │                                   │
  │ CALLIO     │             │                      │            │                          │                                   │
  │ 6          │ Nội dung    │ noi-dung-chi-tiet    │ Custom     │ KHÔNG CẦN                │ AI điền tóm tắt nội dung          │
  │            │ chi tiết    │                      │            │                          │                                   │
  │ 7          │ Chương      │ chuong-trinh---du-an │ Custom     │ ACB Vị thời gian 2025,   │ Tên chương trình/dự án cụ thể     │
  │            │ trình, dự   │                      │            │ JCB Premium Service...   │                                   │
  │            │ án          │                      │            │                          │                                   │
  │ 8          │ Loại dịch   │ loai-dich-vu         │ Custom     │ Golf, Workshop, Fast     │ AI nhận diện qua Keyword          │
  │            │ vụ          │                      │            │ Track, Phòng chờ...      │                                   │
  │ 9          │ Nội dung    │ noi-dung-cuoc-goi    │ Custom     │ Call in (Tư vấn, Đặt     │ AI phân loại ý định khách hàng    │
  │            │ cuộc gọi    │                      │            │ dịch vụ, Hủy...), Call   │                                   │
  │            │             │                      │            │ out...                   │                                   │
  │ 10         │ Mã PSUB     │ ma-psub              │ Custom     │ KHÔNG CẦN                │ AI trích xuất mã số từ lời nói    │
  │ 11         │ Độ ưu tiên  │ do-uu-tien           │ Custom     │ Khẩn cấp (04h), Cao      │ Nhận diện mức độ gấp rút          │
  │            │             │                      │            │ (24h), Bình thường...    │                                   │
  │ 12         │ SLA         │ sla                  │ Custom     │ 04 giờ, 24 giờ, 24 giờ ~ │ Map tương ứng với Độ ưu tiên      │
  │            │             │                      │            │ 48 giờ...                │                                   │
  │ 13         │ Kênh sử     │ kenh-su-dung         │ Custom     │ UrBox App, Phiếu quà     │ Kênh khách hàng thao tác          │
  │            │ dụng        │                      │            │ tặng, Whitelabel...      │                                   │
  │ 14         │ Nguyên nhân │ nguyen-nhan          │ Custom     │ (Nếu có)                 │ Chỉ dùng khi là ticket khiếu nại  │
  │            │ khiếu nại   │                      │            │                          │                                   │
  │ 15         │ Nguyên nhân │ nguyen-nhan-chi-tiet │ Custom     │ (Nếu có)                 │ Chỉ dùng khi là ticket khiếu nại  │
  │            │ phát sinh   │                      │            │                          │                                   │
  │ 16         │ Phương án   │ phuong-an-xu-ly      │ Custom     │ (Nếu có)                 │ Giải pháp AI tư vấn               │