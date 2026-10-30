using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using QLDACNTTnhom10.Security;

namespace QLDACNTTnhom10.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Policy = AccessPolicies.Operations)]
public class DashboardController(IConfiguration configuration) : ControllerBase
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Missing database connection.");

    // Operational data deliberately excludes revenue, package margins and staff performance.
    [HttpGet("operations")]
    public async Task<IActionResult> GetOperations(CancellationToken cancellationToken)
    {
        await using var connection = new SqlConnection(_connectionString);
        const string sql = """
            DECLARE @Today date = CAST(GETDATE() AS date);
            SELECT @Today AS AsOf,
                (SELECT COUNT(*) FROM CHECK_INS WHERE CheckInTime >= @Today AND CheckInTime < DATEADD(day,1,@Today)) AS TodayCheckIns,
                (SELECT COUNT(*) FROM CLASS_SCHEDULES WHERE StartTime >= @Today AND StartTime < DATEADD(day,1,@Today)) AS TodayClasses,
                (SELECT COUNT(*) FROM CONTRACTS WHERE Status=N'Active' AND EndDate >= @Today AND EndDate < DATEADD(day,8,@Today)) AS ExpiringSoonContracts,
                (SELECT COUNT(*) FROM AI_PREDICTIONS WHERE IsHandled=0) AS PendingCare;
            SELECT s.ScheduleID, c.ClassName, s.Room, s.StartTime, s.EndTime, c.Capacity,
                (SELECT COUNT(*) FROM CHECK_INS ci WHERE ci.ScheduleID=s.ScheduleID) AS CurrentBooked
            FROM CLASS_SCHEDULES s JOIN CLASSES c ON c.ClassID=s.ClassID
            WHERE s.StartTime >= @Today AND s.StartTime < DATEADD(day,1,@Today)
            ORDER BY s.StartTime;
            SELECT TOP (8) ap.PredictionID, m.FullName, m.Phone, c.EndDate, ap.RiskLevel,
                DATEDIFF(day,@Today,c.EndDate) AS DaysRemaining
            FROM AI_PREDICTIONS ap JOIN MEMBERS m ON m.MemberID=ap.MemberID
            JOIN CONTRACTS c ON c.ContractID=ap.ContractID
            WHERE ap.IsHandled=0
            ORDER BY CASE ap.RiskLevel WHEN N'High' THEN 0 WHEN N'Medium' THEN 1 ELSE 2 END, c.EndDate, ap.PredictionID;
            """;
        using var results = await connection.QueryMultipleAsync(new CommandDefinition(sql, cancellationToken: cancellationToken));
        var summary = await results.ReadSingleAsync();
        var classes = (await results.ReadAsync()).ToList();
        var careQueue = (await results.ReadAsync()).ToList();
        return Ok(new { Summary = summary, Classes = classes, CareQueue = careQueue });
    }

    [HttpGet("management")]
    [Authorize(Policy = AccessPolicies.Administration)]
    public async Task<IActionResult> GetManagement([FromQuery] string period = "current", CancellationToken cancellationToken = default)
    {
        if (period is not ("current" or "prev" or "quarter" or "year"))
            return BadRequest(new { Message = "Khoảng thời gian không hợp lệ." });
        await using var connection = new SqlConnection(_connectionString);
        const string sql = """
            DECLARE @Today date = CAST(GETDATE() AS date);
            DECLARE @Month date = DATEFROMPARTS(YEAR(@Today),MONTH(@Today),1);
            DECLARE @From date = CASE @Period WHEN 'prev' THEN DATEADD(month,-1,@Month)
                WHEN 'quarter' THEN DATEFROMPARTS(YEAR(@Today),((MONTH(@Today)-1)/3)*3+1,1)
                WHEN 'year' THEN DATEFROMPARTS(YEAR(@Today),1,1) ELSE @Month END;
            DECLARE @Until date = CASE WHEN @Period='prev' THEN @Month ELSE DATEADD(day,1,@Today) END;
            SELECT @Today AS AsOf, @From AS FromDate, DATEADD(day,-1,@Until) AS ToDate,
                (SELECT ISNULL(SUM(Amount),0) FROM PAYMENTS WHERE Status=N'Completed' AND PaymentDate>=@From AND PaymentDate<@Until) AS Revenue,
                (SELECT COUNT(*) FROM MEMBERS m JOIN USERS u ON u.UserID=m.UserID WHERE u.IsActive=1) AS ActiveMembers,
                (SELECT COUNT(*) FROM CHECK_INS WHERE CheckInTime>=@Today AND CheckInTime<DATEADD(day,1,@Today)) AS TodayCheckIns,
                (SELECT COUNT(*) FROM CONTRACTS WHERE Status=N'Active' AND EndDate>=@Today AND EndDate<DATEADD(day,8,@Today)) AS ExpiringSoonContracts;
            SELECT CAST(PaymentDate AS date) AS Day, SUM(Amount) AS Amount FROM PAYMENTS
            WHERE Status=N'Completed' AND PaymentDate>=@From AND PaymentDate<@Until GROUP BY CAST(PaymentDate AS date) ORDER BY Day;
            SELECT CAST(CreatedAt AS date) AS Day, COUNT(*) AS Count FROM MEMBERS
            WHERE CreatedAt>=@From AND CreatedAt<@Until GROUP BY CAST(CreatedAt AS date) ORDER BY Day;
            SELECT pkg.PackageName, SUM(p.Amount) AS Amount FROM PAYMENTS p
            JOIN CONTRACTS c ON c.ContractID=p.ContractID JOIN PACKAGES pkg ON pkg.PackageID=c.PackageID
            WHERE p.Status=N'Completed' AND p.PaymentDate>=@From AND p.PaymentDate<@Until GROUP BY pkg.PackageName ORDER BY Amount DESC;
            SELECT DATEPART(hour,CheckInTime) AS Hour, COUNT(*) AS Count FROM CHECK_INS
            WHERE CheckInTime>=@From AND CheckInTime<@Until GROUP BY DATEPART(hour,CheckInTime) ORDER BY Hour;
            """;
        using var results = await connection.QueryMultipleAsync(new CommandDefinition(sql, new { Period = period }, cancellationToken: cancellationToken));
        var summary = await results.ReadSingleAsync();
        var revenue = (await results.ReadAsync()).ToList();
        var registrations = (await results.ReadAsync()).ToList();
        var packages = (await results.ReadAsync()).ToList();
        var checkIns = (await results.ReadAsync()).ToList();
        return Ok(new { Summary = summary, Revenue = revenue, Registrations = registrations, Packages = packages, CheckIns = checkIns });
    }
}
