# FitManage — GYM & YOGA MANAGEMENT SUITE (NHÓM 10)

Hệ thống Quản lý Phòng tập Gym & Yoga thông minh tích hợp AI Dự báo Giữ chân Hội viên (AI Retention Copilot), Phân quyền đa vai trò (RBAC), Thẻ hội viên điện tử E-Card và Báo cáo Doanh thu chuyên sâu.

---

## 📋 Mục lục
1. [Yêu cầu môi trường](#1-yêu-cầu-môi-trường)
2. [Cài đặt Cơ sở dữ liệu (Database Setup)](#2-cài-đặt-cơ-sở-dữ-liệu-database-setup)
3. [Cấu hình & Khởi chạy dự án](#3-cấu-hình--khởi-chạy-dự-án)
4. [Danh sách tài khoản kiểm thử mặc định](#4-danh-sách-tài-khoản-kiểm-thử-mặc-định)
5. [Phân quyền hệ thống (RBAC Guide)](#5-phân-quyền-hệ-thống-rbac-guide)
6. [API Swagger & Xuất báo cáo Excel](#6-api-swagger--xuất-báo-cáo-excel)

---

## 1. Yêu cầu môi trường
* **.NET 8 SDK** (Kiểm tra bằng lệnh: `dotnet --version`)
* **Microsoft SQL Server** (Bản `SQLEXPRESS` hoặc `Developer Edition`)
* **SQL Server Management Studio (SSMS)** hoặc **Azure Data Studio**
* Trình duyệt web hiện đại: Chrome, Edge, Firefox, Brave...

---

## 2. Cài đặt Cơ sở dữ liệu (Database Setup)

Toàn bộ cấu trúc bảng và dữ liệu mẫu đã được đóng gói sẵn trong file [`database_setup.sql`](./QLDACNTTnhom10/database_setup.sql).

### Cách thực hiện (1 cú click chuột):
1. Mở **SQL Server Management Studio (SSMS)** và kết nối vào SQL Server cục bộ (`.\SQLEXPRESS` hoặc `(local)`).
2. Mở file: `QLDACNTTnhom10/database_setup.sql`.
3. Nhấn **Execute (F5)** để chạy.
4. Script sẽ tự động:
   * Tạo cơ sở dữ liệu `GymManagementDB` nếu chưa có.
   * Tạo 11 bảng: `ROLES`, `USERS`, `MEMBERS`, `TRAINERS`, `PACKAGES`, `CLASSES`, `CONTRACTS`, `PAYMENTS`, `CLASS_SCHEDULES`, `CHECK_INS`, `AI_PREDICTIONS`.
   * Nạp đầy đủ dữ liệu mẫu: Danh sách gói tập, HLV, Hội viên, Lịch tập và các tài khoản kiểm thử.

---

## 3. Cấu hình & Khởi chạy dự án

### Bước 1: Kiểm tra chuỗi kết nối
Mở file `QLDACNTTnhom10/appsettings.json`, kiểm tra connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=GymManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```
*(Nếu SQL Server của bạn dùng instance khác `.\SQLEXPRESS`, hãy đổi lại cho phù hợp máy của bạn)*.

### Bước 2: Chạy Backend
Mở Terminal / PowerShell tại thư mục dự án và chạy:
```powershell
cd QLDACNTTnhom10
dotnet run
```

### Bước 3: Truy cập Web
Sau khi chạy thành công, mở trình duyệt vào một trong các địa chỉ sau:
* **Giao diện Web:** [http://localhost:5010](http://localhost:5010) hoặc [https://localhost:7158](https://localhost:7158)
* **Tài liệu API Swagger:** [https://localhost:7158/swagger](https://localhost:7158/swagger)

---

## 4. Danh sách tài khoản kiểm thử mặc định

Hệ thống đã nạp sẵn các tài khoản với từng vai trò tương ứng để các thành viên tiện kiểm thử chức năng:

| Vai trò (Role) | Tên đăng nhập (Username) | Mật khẩu | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin_gym` | `123456` | **Toàn quyền:** Xem tổng doanh thu & biểu đồ tài chính, tạo lớp học, xuất Excel, quản lý HLV/Hợp đồng. |
| **Nhân viên (Staff)** | `staff_sale` | `123456` | Quản lý hội viên, check-in ra vào, lập hợp đồng, xếp lịch (Ẩn toàn bộ số liệu tài chính để bảo mật). |
| **Huấn luyện viên (Trainer)** | `pt_tuan` *(hoặc `yoga_hoa`)* | `123456` | Xem danh sách lớp được phân công, lịch dạy cá nhân. |
| **Hội viên (Member)** | `mem_nhiem` *(hoặc `mem_khoi`)* | `123456` | Cổng thông tin thẻ VIP E-Card, quét mã QR Check-in RFID, xem gói tập & lịch tập. |

---

## 5. Phân quyền hệ thống (RBAC Guide)

* **Xem Tổng doanh thu:** Chỉ tài khoản **Admin** (`admin_gym`) mới hiển thị thẻ KPI *"Doanh thu trong kỳ"*, biểu đồ *"Doanh thu & Hội viên mới"*, biểu đồ *"Tỷ trọng doanh thu theo gói"*.
* **Bảo vệ Nhân viên (Staff):** Khi đăng nhập bằng `staff_sale`, thẻ doanh thu tự động ẩn và chuyển thành thẻ vận hành *(Lượt check-in hôm nay, Hợp đồng cần chăm sóc gia hạn)*.
* **Cổng Hội viên:** Hội viên khi đăng nhập sẽ tự động chuyển hướng đến `/account.html` để xem thẻ tập cá nhân.
* **Chuyển đổi ngôn ngữ & Thông báo:** Tích hợp bộ chuyển đổi song ngữ Tiếng Việt (VN) / Tiếng Anh (EN) và chuông thông báo hoạt động thời gian thực trên thanh Topbar.

---

## 6. API Swagger & Xuất báo cáo Excel

* **Xuất Excel danh sách Hội viên:** `GET /api/Reports/export-members` (Tải trực tiếp file `.xlsx` danh sách hội viên đầy đủ).
* **Xuất Excel báo cáo Doanh thu:** `GET /api/Reports/export-revenue` (Tải trực tiếp file `.xlsx` chi tiết từng giao dịch).
* **Dự báo Giữ chân AI:** `GET /api/AiRetention/at-risk-members` (Tích hợp mô hình phát hiện nguy cơ bỏ tập và đề xuất kịch bản chăm sóc).
