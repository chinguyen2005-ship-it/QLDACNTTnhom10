# Phân quyền Admin / Staff — FitManage

## Quyền được thực thi

| Nghiệp vụ | Admin | Staff |
|---|---|---|
| Dashboard quản trị, doanh thu, biểu đồ tài chính, báo cáo gia hạn | Có | Không |
| Dashboard công việc hôm nay, hội viên, hợp đồng, lịch lớp, danh sách HLV | Có | Có |
| Tạo/cập nhật hồ sơ hội viên; lập/gia hạn hợp đồng | Có | Có |
| Khóa hội viên; tạo/sửa/ngừng bán gói tập | Có | Không |
| Tạo/sửa/xóa lớp và ca dạy | Có | Không; được xem và hỗ trợ đặt chỗ |
| Đọc kết quả AI và đánh dấu đã chăm sóc | Có | Có |
| Chạy phân tích AI một hợp đồng/toàn bộ | Có | Không |
| Import/Export Excel toàn bộ dữ liệu; kích hoạt quét/gửi email | Có | Không |
| Chiết khấu và mã ưu đãi nhập từ client | Có, kiểm tra giá trị | Không; dùng giá niêm yết |

Các chính sách tập trung trong `Security/AccessPolicies.cs`: `Administration`, `Operations`, `ScheduleRead`. Middleware JWT xác minh token; endpoint kiểm tra role. Giá trị role trong localStorage không cấp quyền API.

Chưa có mô hình phê duyệt khuyến mãi, phân công Staff hoặc phạm vi chi nhánh trong các bảng hiện tại. Vì vậy không giả lập quyền "được giao": Staff đọc danh sách nghiệp vụ chung của trung tâm, không được đọc báo cáo tài chính hoặc tự quyết định giảm giá. Khi có policy/voucher đã duyệt ở backend mới mở áp dụng ưu đãi cho Staff.

## Giao diện

Giữ chung shell, sidebar và các màn hình nghiệp vụ hiện có trong `wwwroot/`. `dashboard.html` đổi nội dung theo role:

- Admin gọi `/api/dashboard/management`: doanh thu trong kỳ, hội viên hoạt động, check-in hôm nay, hợp đồng sắp hết hạn; 3 biểu đồ Chart.js dựa trên PAYMENTS/MEMBERS/CHECK_INS thực tế.
- Staff chỉ gọi `/api/dashboard/operations`: check-in hôm nay, số lớp, hợp đồng hết hạn trong 7 ngày, số dự báo chưa xử lý; lịch hôm nay và hàng đợi chăm sóc. Không trả các trường doanh thu/hoa hồng/giá tiền.
- Sidebar, nút thao tác, modal cấu hình và các nút được tạo động dùng `data-permission`. CSS ẩn mặc định trước khi xác định quyền. Staff nhập URL báo cáo trực tiếp được chuyển về Dashboard.
- Lỗi API không được trình bày như thao tác thành công. Màn hình Dashboard có loading/error/empty/retry; không dùng số liệu mẫu.
- Đã sửa các lỗi cú pháp JavaScript có sẵn làm trang gói tập/HLV không chạy khi thử các màn hình dùng chung.

Phân quyền giao diện chỉ giúp điều hướng. API vẫn từ chối yêu cầu không có quyền, kể cả khi client sửa DOM hoặc sửa claim trong JWT.

## Kiểm tra

```powershell
dotnet build QLDACNTTnhom10/QLDACNTTnhom10.csproj --no-restore
node --test tests/auth.test.cjs tests/permissions.test.cjs
dotnet build tests/server/AuthorizationChecks.csproj --no-restore
dotnet tests/server/bin/Debug/net8.0/AuthorizationChecks.dll
# Đặt URL và 4 mật khẩu test qua biến môi trường; không đưa mật khẩu vào repository.
node --test tests/auth-api.test.cjs tests/roles-api.test.cjs
```

- 10 kiểm tra frontend và 15 kiểm tra API đạt trên SQL Server thật.
- 145 kiểm tra policy đạt, bao gồm Admin/Staff/Trainer/Member và người chưa đăng nhập; không thực thi các action để kiểm tra quyền chạy AI/gửi email.
- 17 inline scripts qua kiểm tra cú pháp. Đã xem Dashboard của cả Admin/Staff, bộ lọc thời gian và các nút hạn chế trên trang hội viên, gói tập, AI; thử Staff mở trực tiếp URL báo cáo.
- Không sửa bản ghi nghiệp vụ thật, không gọi Groq và không gửi email trong kiểm tra; các yêu cầu thử cập nhật dùng ID âm không tồn tại hoặc bị chặn trước action.

## Phạm vi còn lại

- Màn hình Trainer/Member cá nhân vẫn là trang tài khoản đang chờ tích hợp; đây không phải bản phân quyền đầy đủ cho portal cá nhân.
- Chưa xây mới quản lý USERS/nhân sự/hoa hồng vì repository chưa có các module đó.
- Một số màn hình nghiệp vụ cũ vẫn có thao tác prototype và dữ liệu minh họa; lần này bảo vệ quyền của các module đó, không tuyên bố đã hoàn tất toàn bộ tích hợp nghiệp vụ.
- Kết nối/khóa cục bộ trong appsettings và mật khẩu tài khoản test không nằm trong PR.
