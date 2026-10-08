// Controllers/TestEmailController.cs
// TASK-373: Controller hỗ trợ Test & Nghiệm thu tính năng thông báo Email
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using QLDACNTTnhom10.Services;

namespace QLDACNTTnhom10.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestEmailController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;
    private readonly IEmailService _emailService;
    private readonly IContractExpiryService _expiryService;

    public TestEmailController(
        IWebHostEnvironment env,
        IConfiguration config,
        IEmailService emailService,
        IContractExpiryService expiryService)
    {
        _env = env;
        _config = config;
        _emailService = emailService;
        _expiryService = expiryService;
    }

    /// <summary>
    /// KỊCH BẢN 1: Xem trước giao diện Email trực tiếp trên Trình duyệt (không cần gửi thật).
    /// GET /api/test-email/preview
    /// </summary>
    [HttpGet("preview")]
    [Produces("text/html")]
    public async Task<IActionResult> PreviewTemplate([FromQuery] int daysRemaining = 5, [FromQuery] string memberName = "Nguyễn Đức Chí Nguyên")
    {
        var templatePath = Path.Combine(_env.WebRootPath, "templates", "email-expiry-reminder.html");
        if (!System.IO.File.Exists(templatePath))
        {
            return NotFound($"Không tìm thấy file template tại: {templatePath}");
        }

        var html = await System.IO.File.ReadAllTextAsync(templatePath);
        var baseUrl = _config["AppSettings:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5218";
        var renewalPath = _config["AppSettings:RenewalPagePath"] ?? "/contract-renewal-modal.html";
        var encodedId = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("892"));
        var renewalLink = $"{baseUrl}{renewalPath}?cid={Uri.EscapeDataString(encodedId)}";

        html = html
            .Replace("{{MemberName}}", memberName)
            .Replace("{{PackageName}}", "Gym + Yoga Full Access (12 Tháng)")
            .Replace("{{ExpiryDate}}", DateTime.Today.AddDays(daysRemaining).ToString("dd/MM/yyyy"))
            .Replace("{{DaysRemaining}}", daysRemaining.ToString())
            .Replace("{{ContractCode}}", "HD-2026-0892")
            .Replace("{{RenewalLink}}", renewalLink)
            .Replace("{{CheckinCount}}", "148")
            .Replace("{{MonthsActive}}", "11")
            .Replace("{{MemberTier}}", "VIP Gold")
            .Replace("{{Year}}", DateTime.Now.Year.ToString());

        return Content(html, "text/html; charset=utf-8");
    }

    /// <summary>
    /// KỊCH BẢN 2: Gửi thử nghiệm 1 Email qua giao thức SMTP đến hộp thư chỉ định.
    /// POST /api/test-email/send-manual?toEmail=your_email@gmail.com&daysRemaining=3
    /// </summary>
    [HttpPost("send-manual")]
    public async Task<IActionResult> SendManualTest(
        [FromQuery] string toEmail,
        [FromQuery] string memberName = "Nguyễn Đức Chí Nguyên",
        [FromQuery] int daysRemaining = 3)
    {
        if (string.IsNullOrWhiteSpace(toEmail) || !toEmail.Contains('@'))
        {
            return BadRequest(new { success = false, message = "Vui lòng cung cấp địa chỉ email hợp lệ (?toEmail=...)." });
        }

        try
        {
            await _emailService.SendContractExpiryReminderAsync(
                toEmail: toEmail,
                memberName: memberName,
                packageName: "Gói Gym & Yoga Premium",
                expiryDate: DateTime.Today.AddDays(daysRemaining),
                daysRemaining: daysRemaining,
                contractId: 892,
                contractCode: "HD-2026-0892",
                checkinCount: 148,
                monthsActive: 11,
                memberTier: "VIP Gold");

            return Ok(new
            {
                success = true,
                message = $"Đã gửi email nhắc hạn thành công tới: {toEmail}",
                sentAt = DateTime.Now,
                daysRemaining = daysRemaining
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Lỗi khi gửi email qua SMTP.",
                error = ex.Message,
                detail = ex.ToString()
            });
        }
    }

    /// <summary>
    /// KỊCH BẢN 3 & 4: Kích hoạt thủ công Background Scan quét DB ngay lập tức (không cần chờ 8h sáng).
    /// POST /api/test-email/trigger-job
    /// </summary>
    [HttpPost("trigger-job")]
    public async Task<IActionResult> TriggerExpiryScanNow()
    {
        try
        {
            var result = await _expiryService.ScanAndSendRemindersAsync();
            return Ok(new
            {
                success = true,
                message = "Tiến trình quét database đã hoàn thành.",
                totalFound = result.TotalFound,
                successCount = result.SuccessCount,
                failedCount = result.FailedCount,
                details = result.Details
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Lỗi trong tiến trình quét DB.",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// KỊCH BẢN KIỂM TRA LOG: Xem lịch sử nhật ký chống spam trong bảng EMAIL_SEND_LOG.
    /// GET /api/test-email/logs
    /// </summary>
    [HttpGet("logs")]
    public async Task<IActionResult> GetSendLogs()
    {
        var connStr = _config.GetConnectionString("DefaultConnection");
        using var conn = new SqlConnection(connStr);

        const string sql = @"
            IF EXISTS (SELECT * FROM sys.tables WHERE name = 'EMAIL_SEND_LOG')
            BEGIN
                SELECT TOP 50 * FROM EMAIL_SEND_LOG ORDER BY SentAt DESC;
            END
            ELSE
            BEGIN
                SELECT 'Bảng EMAIL_SEND_LOG chưa được khởi tạo trong DB' AS Status;
            END";

        var logs = await conn.QueryAsync(sql);
        return Ok(logs);
    }
}
