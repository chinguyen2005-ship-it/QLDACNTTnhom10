// Services/IEmailService.cs
namespace QLDACNTTnhom10.Services;

/// <summary>
/// TASK-373: Interface gửi email nhắc hết hạn hợp đồng tới hội viên.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Gửi email nhắc gia hạn với HTML template và các placeholder động.
    /// Tương thích với email template chuẩn hóa (Table-based, Inline CSS).
    /// </summary>
    /// <param name="toEmail">Email nhận (hội viên)</param>
    /// <param name="memberName">Tên đầy đủ hội viên — {{MemberName}}</param>
    /// <param name="packageName">Tên gói dịch vụ — {{PackageName}}</param>
    /// <param name="expiryDate">Ngày hết hạn — {{ExpiryDate}}</param>
    /// <param name="daysRemaining">Số ngày còn lại — {{DaysRemaining}}</param>
    /// <param name="contractId">ContractID nội bộ (dùng tạo RenewalLink)</param>
    /// <param name="contractCode">Mã hợp đồng hiển thị — {{ContractCode}}</param>
    /// <param name="checkinCount">Số buổi đã check-in — {{CheckinCount}}</param>
    /// <param name="monthsActive">Số tháng gắn bó — {{MonthsActive}}</param>
    /// <param name="memberTier">Hạng hội viên (VIP Gold, Standard...) — {{MemberTier}}</param>
    /// <param name="ct">CancellationToken</param>
    Task SendContractExpiryReminderAsync(
        string toEmail,
        string memberName,
        string packageName,
        DateTime expiryDate,
        int daysRemaining,
        int contractId,
        string contractCode,
        int checkinCount      = 0,
        int monthsActive      = 0,
        string memberTier     = "Standard",
        CancellationToken ct  = default);
}
