// Services/ContractExpiryService.cs
// TASK-373: Service thực thi nghiệp vụ quét hợp đồng và gửi email thông báo
using Dapper;
using Microsoft.Data.SqlClient;

namespace QLDACNTTnhom10.Services;

public class ContractExpiryService : IContractExpiryService
{
    private readonly IEmailService _emailService;
    private readonly ILogger<ContractExpiryService> _logger;
    private readonly string _connectionString;

    public ContractExpiryService(
        IEmailService emailService,
        ILogger<ContractExpiryService> logger,
        IConfiguration config)
    {
        _emailService     = emailService;
        _logger           = logger;
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<ScanResult> ScanAndSendRemindersAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("[ExpiryScanner] 🔍 Bắt đầu quét các hợp đồng sắp hết hạn...");

        const string scanSql = @"
            SELECT 
                c.ContractID,
                'HD-' + CAST(YEAR(c.StartDate) AS NVARCHAR) + '-' 
                      + RIGHT('0000' + CAST(c.ContractID AS NVARCHAR), 4) AS ContractCode,
                c.EndDate,
                DATEDIFF(DAY, CAST(GETDATE() AS DATE), c.EndDate) AS DaysRemaining,
                u.Email,
                m.FullName,
                p.PackageName,
                ISNULL(DATEDIFF(MONTH, MIN(c2.StartDate) OVER (PARTITION BY c.MemberID), GETDATE()), 0) AS MonthsActive,
                ISNULL(
                    (SELECT COUNT(*) FROM CHECKINS ci WHERE ci.MemberID = c.MemberID), 
                    0
                ) AS CheckinCount,
                ISNULL(m.MemberTier, 'Standard') AS MemberTier,
                CASE 
                    WHEN DATEDIFF(DAY, CAST(GETDATE() AS DATE), c.EndDate) <= 3 
                    THEN '3days' 
                    ELSE '7days' 
                END AS MilestoneKey
            FROM CONTRACTS c
            JOIN MEMBERS  m ON c.MemberID  = m.MemberID
            JOIN USERS    u ON m.UserID     = u.UserID
            JOIN PACKAGES p ON c.PackageID  = p.PackageID
            LEFT JOIN CONTRACTS c2 ON c.MemberID = c2.MemberID
            WHERE 
                c.Status = 'Active'
                AND u.IsActive = 1
                AND u.Email IS NOT NULL
                AND u.Email != ''
                AND DATEDIFF(DAY, CAST(GETDATE() AS DATE), c.EndDate) IN (7, 3)
                AND NOT EXISTS (
                    SELECT 1 
                    FROM EMAIL_SEND_LOG esl
                    WHERE esl.ContractID   = c.ContractID
                      AND esl.IsSuccess    = 1
                      AND esl.MilestoneKey = 
                          CASE 
                              WHEN DATEDIFF(DAY, CAST(GETDATE() AS DATE), c.EndDate) <= 3 
                              THEN '3days' 
                              ELSE '7days' 
                          END
                )";

        var details = new List<string>();

        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync(ct);

        // Đảm bảo bảng EMAIL_SEND_LOG tồn tại
        await EnsureLogTableExistsAsync(conn);

        var contracts = (await conn.QueryAsync(scanSql)).ToList();
        _logger.LogInformation("[ExpiryScanner] 📬 Tìm thấy {Count} hợp đồng đủ điều kiện gửi email nhắc.", contracts.Count);

        if (contracts.Count == 0)
        {
            return new ScanResult(0, 0, 0, new List<string> { "Không có hợp đồng nào cần nhắc nhở hôm nay (hoặc đã gửi đủ)." });
        }

        int successCount = 0;
        int failedCount  = 0;

        foreach (var c in contracts)
        {
            if (ct.IsCancellationRequested) break;

            int contractId     = (int)c.ContractID;
            string contractCode = (string)c.ContractCode;
            string toEmail     = (string)c.Email;
            string memberName  = (string)c.FullName;
            string packageName = (string)c.PackageName;
            DateTime endDate   = (DateTime)c.EndDate;
            int daysRemaining  = (int)c.DaysRemaining;
            int checkinCount   = (int)c.CheckinCount;
            int monthsActive   = (int)c.MonthsActive;
            string memberTier  = (string)(c.MemberTier ?? "Standard");
            string milestone   = (string)c.MilestoneKey;

            try
            {
                await _emailService.SendContractExpiryReminderAsync(
                    toEmail:       toEmail,
                    memberName:    memberName,
                    packageName:   packageName,
                    expiryDate:    endDate,
                    daysRemaining: daysRemaining,
                    contractId:    contractId,
                    contractCode:  contractCode,
                    checkinCount:  checkinCount,
                    monthsActive:  monthsActive,
                    memberTier:    memberTier,
                    ct:            ct);

                await WriteLogAsync(conn, contractId, milestone, toEmail, true, null);
                successCount++;
                details.Add($"[THÀNH CÔNG] Đã gửi tới {toEmail} ({memberName}) - HĐ: {contractCode} (Còn {daysRemaining} ngày)");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ExpiryScanner] ❌ Lỗi gửi email cho HĐ {Code}", contractCode);
                await WriteLogAsync(conn, contractId, milestone, toEmail, false, ex.Message);
                failedCount++;
                details.Add($"[THẤT BẠI] Gửi tới {toEmail} - HĐ: {contractCode} - Lỗi: {ex.Message}");
            }
        }

        _logger.LogInformation("[ExpiryScanner] ✅ Quét hoàn tất. Thành công: {S}, Thất bại: {F}", successCount, failedCount);
        return new ScanResult(contracts.Count, successCount, failedCount, details);
    }

    private static async Task EnsureLogTableExistsAsync(SqlConnection conn)
    {
        const string createTableSql = @"
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EMAIL_SEND_LOG')
            BEGIN
                CREATE TABLE EMAIL_SEND_LOG (
                    LogID INT IDENTITY(1,1) PRIMARY KEY,
                    ContractID INT NOT NULL,
                    MilestoneKey NVARCHAR(50) NOT NULL,
                    RecipientEmail NVARCHAR(255) NOT NULL,
                    IsSuccess BIT NOT NULL DEFAULT 1,
                    ErrorMessage NVARCHAR(MAX) NULL,
                    SentAt DATETIME NOT NULL DEFAULT GETDATE()
                );
                CREATE INDEX IX_EMAIL_SEND_LOG_Contract_Milestone ON EMAIL_SEND_LOG(ContractID, MilestoneKey, IsSuccess);
            END";
        await conn.ExecuteAsync(createTableSql);
    }

    private static async Task WriteLogAsync(
        SqlConnection conn,
        int contractId,
        string milestoneKey,
        string email,
        bool isSuccess,
        string? errorMessage)
    {
        const string sql = @"
            IF NOT EXISTS (
                SELECT 1 FROM EMAIL_SEND_LOG 
                WHERE ContractID   = @ContractID 
                  AND MilestoneKey = @MilestoneKey 
                  AND IsSuccess    = 1
            )
            BEGIN
                INSERT INTO EMAIL_SEND_LOG 
                    (ContractID, MilestoneKey, RecipientEmail, IsSuccess, ErrorMessage, SentAt)
                VALUES 
                    (@ContractID, @MilestoneKey, @Email, @IsSuccess, @ErrorMessage, GETDATE())
            END";

        await conn.ExecuteAsync(sql, new
        {
            ContractID   = contractId,
            MilestoneKey = milestoneKey,
            Email        = email,
            IsSuccess    = isSuccess,
            ErrorMessage = errorMessage
        });
    }
}
