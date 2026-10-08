// Services/IContractExpiryService.cs
// TASK-373: Interface xử lý quét và gửi email nhắc hợp đồng sắp hết hạn
namespace QLDACNTTnhom10.Services;

public record ScanResult(
    int TotalFound,
    int SuccessCount,
    int FailedCount,
    List<string> Details);

public interface IContractExpiryService
{
    /// <summary>
    /// Quét database và gửi email nhắc nhở cho các hợp đồng còn 7 ngày và 3 ngày hết hạn.
    /// Có cơ chế chống spam (Idempotency) dựa trên bảng EMAIL_SEND_LOG.
    /// </summary>
    Task<ScanResult> ScanAndSendRemindersAsync(CancellationToken ct = default);
}
