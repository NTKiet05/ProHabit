# 🚀 ProHabit - Executive Discipline & Continuous Learning Platform

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-0056d2?style=for-the-badge&logo=github)](https://ntkiet05.github.io/ProHabit/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-f59e0b?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Tech: Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6+-0a66c2?style=for-the-badge)](https://developer.mozilla.org/)

**ProHabit** là nền tảng quản lý lối sống kỷ luật và theo dõi học tập chuyên sâu, kết hợp tinh tế giữa phong cách điều hành thanh lịch của **LinkedIn** và trải nghiệm học tập chuẩn mực của **Coursera**.

🌐 **Trải nghiệm trực tuyến ngay tại:** [https://ntkiet05.github.io/ProHabit/](https://ntkiet05.github.io/ProHabit/)

---

## 🌟 Tính Năng Nổi Bật

### 1. 📊 Bảng Ma Trận Theo Dõi Thói Quen (31-Day Habit Spreadsheet)
- **Ma trận 31 ngày trực quan**: Dễ dàng theo dõi và tick hoàn thành thói quen từng ngày.
- **Tự động làm nổi bật ngày hiện tại**: Cột ngày hôm nay được đánh dấu rõ ràng, không lo tick nhầm ngày.
- **⚡ Điểm năng suất (Productivity Score)**: Thuật toán tính điểm 0-100 dựa trên tiến độ hoàn thành thói quen và công việc.
- **🔥 Chuỗi kỷ luật (Streak Counter)**: Đếm chuỗi ngày duy trì kỷ luật liên tục để khích lệ tinh thần.
- **🌿 Sức khỏe & Tinh thần (Overall Wellness)**: Ghi chép số giờ ngủ thực tế và theo dõi tâm trạng mỗi ngày.
- **Biểu đồ trực quan**: Biểu đồ cột tiến độ hàng ngày, tiến độ tuần và tỷ lệ hoàn thành mục tiêu.

### 2. 🎓 Phân Hệ Khóa Học & Điểm Danh (Coursera-Style LMS)
- **Lộ trình học tập kỷ luật cao**: Phân chia khóa học theo từng Chặng (Milestones) với thanh tiến độ % trực quan.
- **Nhật ký điểm danh & Thu hoạch tiết học**: Ghi lại kiến thức cốt lõi và bài học đúc kết sau mỗi buổi học.
- **Tài liệu tham khảo đính kèm**: Lưu trữ tập trung liên kết sách giáo trình, slide bài giảng, code mẫu, cheat sheets.
- **Danh mục khóa học bên phải**: Chuyển đổi nhanh chóng giữa các môn học đang theo đuổi.

### 3. 🕒 Thời Gian Biểu & Danh Sách Công Việc (Schedule & TODO List)
- **Quản lý thời gian biểu hàng ngày**:
  - Cửa sổ nhập liệu rộng rãi, hiển thị rõ ràng từng trường thông tin.
  - Tích hợp 4 nút chọn nhanh các khung giờ phổ biến trong ngày.
  - Hỗ trợ nhập nhanh lịch biểu tự động từ File (*Excel, CSV, PDF, OCR Hình ảnh*).
- **TODO List thông minh**:
  - Phân loại công việc theo Deadline, mức độ ưu tiên (*Khẩn cấp, Cao, Bình thường*).
  - Tự động phát hiện và cảnh báo công việc quá hạn (*Overdue Alert Banner*).

### 4. 👤 Hồ Sơ Cá Nhân & Không Gian Làm Việc Siêu Rộng (Ultra-Wide Canvas)
- **Chỉnh sửa hồ sơ cá nhân (Edit Profile)**: Tùy biến Họ tên, Chức danh/Khẩu hiệu kỷ luật, Avatar (Initials hoặc Link ảnh) và Bio châm ngôn.
- **Bố cục Ultra-Wide (Max-width 1820px, chiếm 96% màn hình)**:
  - Tự động ẩn cột phụ ở tab Thói quen để bảng tính rộng hơn 1450px.
  - Nút **"Ẩn thông tin chung" / "Hiện thông tin chung" 1-Click** giúp toàn quyền kiểm soát không gian làm việc.
- **Chế độ hiển thị kép**:
  - 🌙 **Giao diện Tối (Obsidian Dark)**: Chuẩn điều hành cao cấp, chống mỏi mắt ban đêm.
  - ☀️ **Giao diện Sáng (Executive Light)**: Tương phản cao, sắc nét, chuyên nghiệp.

---

## 💻 Cấu Trúc Dự Án

```
habit-tracker/
├── index.html        # Giao diện chính HTML5 Semantic chuẩn SEO & A11y
├── styles.css        # Hệ thống CSS Design System, Responsive & Dual-Theme
├── app.js            # Core logic, LocalStorage State, Modal, Chart & PWA
├── sw.js             # Service Worker quản lý bộ nhớ đệm Offline Cache
├── manifest.json     # Tệp cấu hình PWA cài đặt App trên Mobile/PC
├── design.md         # Tài liệu thiết kế & quy chuẩn kiến trúc ban đầu
├── README.txt        # Tài liệu hướng dẫn bản Text
└── README.md         # Tài liệu dự án bản Markdown hiển thị trên GitHub
```

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### Chạy trực tiếp
Chỉ cần nhấp đúp mở file `index.html` trên bất kỳ trình duyệt nào.

### Chạy qua Local Web Server
```bash
# Di chuyển vào thư mục dự án
cd "C:\Users\Tuan Kiet\.gemini\antigravity\scratch\habit-tracker"

# Chạy server cục bộ bằng Python
python -m http.server 8888
```
Truy cập: `http://localhost:8888`

### Cài đặt thành Ứng dụng (PWA)
- **Máy tính (Chrome/Edge)**: Bấm biểu tượng Cài đặt ở góc phải thanh địa chỉ $\rightarrow$ Chọn **"Cài đặt ProHabit"**.
- **Điện thoại (iOS/Android)**: Mở link trên trình duyệt $\rightarrow$ Bấm nút Chia sẻ $\rightarrow$ Chọn **"Thêm vào màn hình chính"**.

---

## 🔄 Cập Nhật Mã Nguồn Lên GitHub Pages

Sau khi sửa đổi mã nguồn cục bộ, chạy các lệnh sau để tự động cập nhật website:

```bash
git add .
git commit -m "Cập nhật tính năng mới"
git push origin main
```

---

## 🛠️ Công Nghệ Sử Dụng
- **Core**: Vanilla HTML5, CSS3 Variables, JavaScript ES6+ (*Zero Framework, Tối ưu tốc độ*).
- **Lưu trữ**: LocalStorage (*Offline-First, không tốn API/Token*) + Hỗ trợ Supabase Client.
- **Fonts**: Google Fonts (*Nunito, Plus Jakarta Sans, Outfit*).
- **Thư viện**: `xlsx.js`, `pdf.js`, `tesseract.js`, `canvas-confetti`.

---

© 2026 **Nguyễn Tuấn Kiệt** - Dự án phục vụ mục tiêu học tập và rèn luyện kỷ luật bản thân.
