================================================================================
                    PROHABIT - EXECUTIVE DISCIPLINE PLATFORM
       Bảng Điều Khiển Quản Lý Thói Quen, Lộ Trình Học Tập & Lịch Trình Cá Nhân
================================================================================

* Tác giả: Nguyễn Tuấn Kiệt
* Bản quyền: MIT License (Dự án mã nguồn mở)
* Trang web trực tuyến (GitHub Pages): https://ntkiet05.github.io/ProHabit/
* Phiên bản: 2.0.0 (Bản nâng cấp toàn diện giao diện & tính năng)

--------------------------------------------------------------------------------
1. GIỚI THIỆU TỔNG QUAN
--------------------------------------------------------------------------------
ProHabit là ứng dụng web quản lý lối sống kỷ luật và theo dõi học tập chuyên sâu,
kết hợp phong cách tối giản chuẩn điều hành của LinkedIn và trải nghiệm học tập
chuyên nghiệp của Coursera.

Ứng dụng hoạt động theo triết lý "Offline-First" (Ưu tiên ngoại tuyến), lưu trữ
toàn bộ dữ liệu trực tiếp trong LocalStorage của trình duyệt, không tốn chi phí
API/Token, bảo mật dữ liệu tuyệt đối và hỗ trợ cài đặt PWA (Progressive Web App)
trên cả máy tính lẫn điện thoại thông minh.

--------------------------------------------------------------------------------
2. CÁC TÍNH NĂNG CHÍNH
--------------------------------------------------------------------------------

[A] BẢNG MA TRẬN THÓI QUEN (SPREADSHEET HABIT TRACKER)
- Bảng tính 31 ngày trực quan dạng lưới ma trận: Theo dõi thói quen từng ngày.
- Tự động đánh dấu ngày hiện tại (Highlight Today) để không bị nhầm lẫn.
- Hệ thống tính điểm năng suất (Productivity Score) từ 0-100 dựa trên tỷ lệ
  hoàn thành thói quen và mức độ hoàn thành công việc đúng hạn.
- Đếm chuỗi ngày kỷ luật liên tục (Streak Counter 🔥) giúp duy trì động lực.
- Phân hệ Sức khỏe & Tinh thần (Overall Wellness): Ghi chép số giờ ngủ, đánh giá
  tâm trạng mỗi ngày.
- Biểu đồ tiến độ trực quan: Tiến độ hàng ngày, tiến độ tuần, phân tích tổng quan.

[B] LỘ TRÌNH KHÓA HỌC & ĐIỂM DANH (COURSERA-STYLE LMS)
- Quản lý lộ trình khóa học chuyên sâu (Mặc định: Lý thuyết & Kỹ thuật Điều
  khiển Tự động - Control Systems).
- Phân chia bài học theo từng Chặng (Milestones), kiểm soát tiến độ % khóa học.
- Nhật ký điểm danh & Ghi chú thu hoạch tiết học: Ghi lại bài học cốt lõi sau
  mỗi buổi học kèm thời gian điểm danh chi tiết.
- Thư viện tài liệu đính kèm: Lưu trữ liên kết giáo trình, slide, code mẫu,
  cheat sheets phục vụ nghiên cứu sâu.
- Thanh chuyển đổi danh mục khóa học nhanh chóng ở cột bên phải.

[C] QUẢN LÝ THỜI GIAN BIỂU & DANH SÁCH VIỆC CẦN LÀM (SCHEDULE & TODO)
- Quản lý thời gian biểu hàng ngày:
  + Cửa sổ nhập liệu rộng rãi (644px), hiển thị rõ ràng từng trường thông tin.
  + Tích hợp 4 nút chọn nhanh các khung giờ phổ biến (Sáng sớm, Sáng, Chiều, Tối).
  + Nhập nhanh thời gian biểu tự động từ File (Excel, CSV, PDF, OCR Hình ảnh).
- Danh sách công việc cần làm (TODO List):
  + Quản lý công việc theo hạn chót (Deadline), mức độ ưu tiên (Khẩn cấp, Cao, Bình thường).
  + Tự động phát hiện và gửi cảnh báo việc quá hạn (Overdue Alert Banner).
  + Thống kê số lượng việc chưa hoàn thành theo thời gian thực.

[D] HỒ SƠ CÁ NHÂN & TỐI ƯU KHÔNG GIAN LÀM VIỆC (ULTRA-WIDE CANVAS)
- Chỉnh sửa hồ sơ cá nhân (Edit Profile):
  + Tùy chỉnh Họ tên, Chức danh/Khẩu hiệu kỷ luật, Giới thiệu bản thân (Bio).
  + Hỗ trợ Avatar chữ lồng (Initials) hoặc dán link ảnh thật từ internet.
- Thiết kế Ultra-Wide (Khung hiển thị rộng đến 1820px, chiếm 96% màn hình):
  + Tự động ẩn thanh bên phải ở tab Thói quen để tăng diện tích bảng tính lên hơn 1450px.
  + Nút "Ẩn thông tin chung" / "Hiện thông tin chung" 1-Click: Thu gọn cột trái
    để trải nghiệm màn hình rộng tối đa, kèm tab nổi mép trái để hoàn nguyên tức thì.
- Chế độ hiển thị kép:
  + Giao diện Tối (Obsidian Dark) - Chuyên nghiệp, bảo vệ mắt khi làm việc đêm.
  + Giao diện Sáng (Executive Light) - Tươi sáng, độ tương phản cao, chuẩn văn phòng.

--------------------------------------------------------------------------------
3. CẤU TRÚC MÃ NGUỒN (PROJECT STRUCTURE)
--------------------------------------------------------------------------------
habit-tracker/
│
├── index.html        # Khung giao diện chính (HTML5 Semantic, LinkedIn/Coursera UI)
├── styles.css        # Hệ thống Design System, Biến CSS, Responsive & Dark/Light theme
├── app.js            # Logic nghiệp vụ, LocalStorage State, Modal, Chart, PWA Logic
├── sw.js             # Service Worker điều hướng bộ nhớ đệm Offline Cache
├── manifest.json     # Tệp khai báo cấu hình cài đặt ứng dụng PWA
├── design.md         # Tài liệu đặc tả yêu cầu & triết lý thiết kế ban đầu
├── README.txt        # Tệp hướng dẫn & mô tả dự án (Bản Text)
└── README.md         # Tệp hướng dẫn & mô tả dự án (Bản Markdown cho GitHub)

--------------------------------------------------------------------------------
4. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN
--------------------------------------------------------------------------------

[Cách 1: Chạy trực tiếp trên trình duyệt]
- Không cần cài đặt bất kỳ thư viện hay framework phức tạp nào.
- Chỉ cần nhấp đúp chuột vào file index.html để mở trong trình duyệt (Chrome, Edge, Firefox, Brave,...).

[Cách 2: Chạy qua Local Web Server (Khuyên dùng để kích hoạt PWA & Service Worker)]
- Mở Terminal hoặc PowerShell tại thư mục dự án:
    cd "C:\Users\Tuan Kiet\.gemini\antigravity\scratch\habit-tracker"
    python -m http.server 8888
- Mở trình duyệt và truy cập: http://localhost:8888

[Cách 3: Cài đặt thành App trên thiết bị (PWA)]
- Trên Máy tính: Bấm vào biểu tượng Cài đặt trên thanh địa chỉ của Chrome/Edge -> Chọn "Cài đặt ProHabit".
- Trên Điện thoại: Mở link trên Safari (iOS) hoặc Chrome (Android) -> Bấm nút Chia sẻ/Menu -> Chọn "Thêm vào Màn hình chính" (Add to Home Screen).

--------------------------------------------------------------------------------
5. HƯỚNG DẪN CẬP NHẬT CODE LÊN GITHUB
--------------------------------------------------------------------------------
Mỗi khi bạn chỉnh sửa mã nguồn trên máy tính, để cập nhật phiên bản mới lên trang
web trực tuyến GitHub Pages:

1. Mở PowerShell hoặc Git Bash tại thư mục dự án:
   cd "C:\Users\Tuan Kiet\.gemini\antigravity\scratch\habit-tracker"

2. Chạy các lệnh Git sau:
   git add .
   git commit -m "Cập nhật tính năng mới"
   git push origin main

3. Sau khoảng 30 - 60 giây, GitHub Pages sẽ tự động cập nhật bản mới nhất tại:
   https://ntkiet05.github.io/ProHabit/

--------------------------------------------------------------------------------
6. CÔNG NGHỆ SỬ DỤNG
--------------------------------------------------------------------------------
- Ngôn ngữ: HTML5, CSS3, JavaScript (ES6+ Native, No Framework).
- Phông chữ: Google Fonts (Nunito, Plus Jakarta Sans, Outfit).
- Thư viện hỗ trợ:
  + XLSX.js (Phân tích file Excel/CSV thời gian biểu)
  + PDF.js & Tesseract.js (Nhập thời gian biểu từ file PDF và Hình ảnh OCR)
  + Canvas Confetti (Hiệu ứng pháo hoa khi hoàn thành mục tiêu kỷ luật)
  + Supabase JS SDK (Tùy chọn đồng bộ dữ liệu đám mây đa thiết bị)

================================================================================
                    CHÚC BẠN XÂY DỰNG KỶ LUẬT BẢN THÂN THÀNH CÔNG!
================================================================================
