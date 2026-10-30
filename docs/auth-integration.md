# FitManage — đăng nhập và đăng ký

## Thiết kế và mã nguồn

- Figma: https://www.figma.com/design/4w4QqZQYjvEdZkZCxfP4nm/FitManage-Suite?node-id=6-6
- AUTH-01 `6:6`, AUTH-02 `9:770`.
- Stitch: https://stitch.withgoogle.com/projects/13412879579149760620
- Login: **Authentication Screen**, node `805a8d4c688347878e1b080e153514f7`.
- Register: **Member Registration (Sign Up) Screen**, node `4be754e032424fe38d49376a78ee019c`.

Đối chiếu Figma bằng trình duyệt vì Figma MCP vẫn hết hạn mức. Dùng HTML thực tế của preview Stitch cho hai màn hình; loại bỏ script phục vụ editor, mã đăng nhập demo và mã tài khoản mẫu. Giữ bố cục split-screen, SVG, thẻ AI, form và màu thiết kế; đồng bộ font DM Sans và nền #f8f9ff theo dự án.

Ảnh avatar đã lưu tại `wwwroot/assets/auth/`. URL ảnh nền gym gốc trả HTTP 403; giữ các lớp nền navy/gradient của chính thiết kế, không dùng ảnh thay thế. Nội dung thẻ AI trên trang xác thực là minh họa tĩnh.

## Hành vi

- `/` mở trang đăng nhập khi chưa có phiên. Admin/Staff vào dashboard hiện hữu; Trainer/Member vào trang xác nhận tài khoản `/account.html` vì khu vực cá nhân chưa được tích hợp vào ứng dụng chính.
- Login gọi `POST /api/auth/login`, hỗ trợ username hoặc email, JWT 8 giờ theo backend. Token lưu bằng khóa `token` để tương thích các màn hình API hiện có. Checkbox chỉ ghi nhớ **tên đăng nhập**, không lưu mật khẩu.
- Register gọi `POST /api/auth/register` với username/password/email, họ tên, điện thoại, ngày sinh và giới tính; tạo USERS và MEMBERS trong cùng transaction. Máy chủ từ chối RoleID khác 4. Client không thể chọn quyền nhân sự.
- Loại bỏ tự đăng nhập Admin trong sidebar và mật khẩu dự phòng `123456` của backend. Dữ liệu seed chưa băm BCrypt cần được quản trị viên đặt lại mật khẩu theo quy trình của nhóm.
- Sidebar hiển thị username/role hiện tại và nút đăng xuất. Kiểm tra token phía client chỉ phục vụ điều hướng; bảo vệ dữ liệu vẫn do `[Authorize]` trên API.
- Form có loading, chặn gửi trùng, thông báo lỗi, giới hạn thời gian chờ và xác nhận đăng ký thành công. Không hiển thị nội dung HTML/stack trace từ lỗi máy chủ.
- Khôi phục mật khẩu và các liên kết điều khoản/bảo mật hiện mở thông tin hỗ trợ; chưa có API reset hoặc tài liệu chính sách để liên kết. Không giả lập gửi email.
- Trang đăng nhập có VI/EN; form đăng ký giữ tiếng Việt của bản Stitch, chưa có bản dịch đầy đủ.
- UI/API cùng origin, bỏ `UseCors("AllowAll")` chưa được đăng ký policy. Nếu triển khai khác origin, cấu hình policy với danh sách origin cụ thể.

## Kiểm tra

```powershell
dotnet build QLDACNTTnhom10/QLDACNTTnhom10.csproj --no-restore
node --test tests/auth.test.cjs
# Khởi chạy một host kiểm tra riêng với kết nối DB thử không trỏ dữ liệu thật.
$env:AUTH_REVIEW_URL='http://127.0.0.1:5213'
node --test tests/auth-api.test.cjs
```

Build thành công. 8 kiểm tra frontend và 5 kiểm tra API đạt. Đã xem desktop 1280×985 và mobile 390×844, kiểm tra không tràn ngang, ảnh tải được, chuyển trang và hiện/ẩn mật khẩu. API tests chỉ gửi payload bị từ chối trước SQL, kiểm tra 400/401 và chặn nâng quyền. Đăng ký thành công, transaction/rollback và đăng nhập thành công trên SQL Server thật chưa được xác minh.

Chưa commit, push hoặc merge. Giữ nguyên các thay đổi có sẵn ngoài phạm vi xác thực; sidebar có phần sửa nhỏ nối vào mã đang làm dở của workspace.

## Kết nối database thật — 31/10/2026

- Đã tạo 4 tài khoản kiểm thử riêng theo yêu cầu: `fit_test_admin`, `fit_test_staff`, `fit_test_trainer`, `fit_test_member`. Mật khẩu BCrypt, không lưu mật khẩu trong repository và không thay đổi tài khoản cũ.
- Bản cục bộ `http://127.0.0.1:5213/login.html` hiện dùng kết nối thật từ `appsettings.json`, không còn connection string và JWT key giả của phiên xem thử.
- Cả 4 role gọi API login thành công (HTTP 200). Admin/Staff gọi GET `/api/Members` thành công và nhận 9 hồ sơ; Trainer/Member nhận 403; khách chưa đăng nhập nhận 401. Không thay đổi dữ liệu trong các lượt kiểm tra API này.
- Khởi chạy bằng `--BackgroundJobs:ContractStatusEnabled=false` để không tự cập nhật hợp đồng/gửi email khi thử giao diện. Tùy chọn mặc định vẫn bật ở các phiên khởi chạy thông thường.
- Kết quả mới bổ sung xác minh đăng nhập trên SQL Server thật; đăng ký thành công và rollback qua HTTP vẫn chưa được kiểm tra.
