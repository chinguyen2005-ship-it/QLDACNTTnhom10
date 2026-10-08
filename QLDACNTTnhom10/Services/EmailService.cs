// Services/EmailService.cs
// TASK-373: Implementation gửi email dùng MailKit + MimeKit
// Đọc HTML template từ wwwroot/templates/ và replace tất cả placeholder động.
// Template chuẩn: Table-based layout, Inline CSS, tương thích Outlook/Gmail/Apple Mail.
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace QLDACNTTnhom10.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<EmailService> _logger;

    public EmailService(
        IConfiguration config,
        IWebHostEnvironment env,
        ILogger<EmailService> logger)
    {
        _config = config;
        _env    = env;
        _logger = logger;
    }

    public async Task SendContractExpiryReminderAsync(
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
        CancellationToken ct  = default)
    {
        // -----------------------------------------------------------------------
        // 1. Đọc HTML template từ wwwroot/templates/email-expiry-reminder.html
        // -----------------------------------------------------------------------
        var templatePath = Path.Combine(
            _env.WebRootPath, "templates", "email-expiry-reminder.html");

        if (!File.Exists(templatePath))
            throw new FileNotFoundException(
                $"[EmailService] Email template không tồn tại tại: {templatePath}. " +
                "Kiểm tra thư mục wwwroot/templates/ trong dự án.");

        var htmlBody = await File.ReadAllTextAsync(templatePath, ct);

        // -----------------------------------------------------------------------
        // 2. Tạo Renewal Link an toàn
        //    Base64(contractId) để che giấu ID thực, tránh IDOR attack
        // -----------------------------------------------------------------------
        var baseUrl     = (_config["AppSettings:BaseUrl"] ?? "http://localhost:5218").TrimEnd('/');
        var renewalPath = _config["AppSettings:RenewalPagePath"] ?? "/contract-renewal-modal.html";
        var encodedId   = Convert.ToBase64String(
            System.Text.Encoding.UTF8.GetBytes(contractId.ToString()));
        var renewalLink = $"{baseUrl}{renewalPath}?cid={Uri.EscapeDataString(encodedId)}";

        // -----------------------------------------------------------------------
        // 3. Replace TẤT CẢ placeholder tokens
        //    Đảm bảo khớp với tên đặt trong template email-expiry-reminder.html
        // -----------------------------------------------------------------------
        htmlBody = htmlBody
            // Core tokens (bắt buộc)
            .Replace("{{MemberName}}",    memberName)
            .Replace("{{PackageName}}",   packageName)
            .Replace("{{ExpiryDate}}",    expiryDate.ToString("dd/MM/yyyy"))
            .Replace("{{DaysRemaining}}", daysRemaining.ToString())
            .Replace("{{ContractCode}}",  contractCode)
            .Replace("{{RenewalLink}}",   renewalLink)
            // Extended tokens (hành trình hội viên)
            .Replace("{{CheckinCount}}",  checkinCount.ToString())
            .Replace("{{MonthsActive}}",  monthsActive.ToString())
            .Replace("{{MemberTier}}",    memberTier)
            // Metadata
            .Replace("{{Year}}",          DateTime.Now.Year.ToString());

        // -----------------------------------------------------------------------
        // 4. Cấu hình MimeMessage
        // -----------------------------------------------------------------------
        var smtp    = _config.GetSection("SmtpSettings");
        var senderName  = smtp["SenderName"] ?? "FitManage Gym & Yoga Suite";
        var senderEmail = smtp["SenderEmail"] ?? "no-reply@fitmanage.com";
        var message = new MimeMessage();

        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress(memberName, toEmail));

        // Subject theo mức độ khẩn cấp (3 ngày vs 7 ngày)
        message.Subject = daysRemaining <= 3
            ? $"🚨 Hợp đồng của {memberName} hết hạn sau {daysRemaining} ngày — Gia hạn ngay!"
            : $"⏰ Nhắc nhở: Gói tập {packageName} còn {daysRemaining} ngày — FitManage";

        // Cung cấp cả plaintext fallback (anti-spam score tốt hơn)
        var textBody = $"Xin chào {memberName},\n\n" +
                       $"Gói tập {packageName} (#{contractCode}) của bạn sẽ hết hạn vào ngày {expiryDate:dd/MM/yyyy} " +
                       $"— còn {daysRemaining} ngày.\n\n" +
                       $"Gia hạn ngay tại: {renewalLink}\n\n" +
                       "Trân trọng,\nFitManage Gym & Yoga Suite\nHotline: 1900 8892";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = htmlBody,
            TextBody = textBody
        };
        message.Body = bodyBuilder.ToMessageBody();

        // -----------------------------------------------------------------------
        // 5. Kết nối SMTP qua MailKit (StartTls — chuẩn Gmail port 587)
        // -----------------------------------------------------------------------
        using var client = new SmtpClient();

        await client.ConnectAsync(
            host:    smtp["Host"],
            port:    int.Parse(smtp["Port"] ?? "587"),
            options: SecureSocketOptions.StartTls,
            cancellationToken: ct);

        await client.AuthenticateAsync(
            userName: smtp["Username"],
            password: smtp["Password"],
            cancellationToken: ct);

        await client.SendAsync(message, ct);
        await client.DisconnectAsync(quit: true, ct);

        _logger.LogInformation(
            "[EmailService] ✅ Sent | To={Email} | Contract={Code} | Days={Days}",
            toEmail, contractCode, daysRemaining);
    }
}
