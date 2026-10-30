using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using QLDACNTTnhom10.Controllers;
using QLDACNTTnhom10.Security;
using System.Reflection;
using System.Security.Claims;

var services = new ServiceCollection();
services.AddLogging();
services.AddFitManageAuthorization();
using var provider = services.BuildServiceProvider();
var policies = provider.GetRequiredService<IAuthorizationPolicyProvider>();
var authorization = provider.GetRequiredService<IAuthorizationService>();
string[] administration = ["Admin"];
string[] operations = ["Admin", "Staff"];
string[] schedules = ["Admin", "Staff", "Trainer", "Member"];
var cases = new List<(Type Controller, string Method, string[] Roles)> {
    (typeof(DashboardController), "GetOperations", operations),
    (typeof(DashboardController), "GetManagement", administration),
    (typeof(AiPredictionsController), "GetAllPredictions", operations),
    (typeof(AiPredictionsController), "AnalyzeContract", administration),
    (typeof(AiPredictionsController), "AnalyzeAllActiveContracts", administration),
    (typeof(AiPredictionsController), "MarkHandled", operations),
    (typeof(MembersController), "DeleteMember", administration),
    (typeof(ContractsController), "CreateContract", operations),
    (typeof(ContractsController), "RenewContract", operations),
    (typeof(ContractsController), "TriggerEmailCronjob", administration),
    (typeof(ClassesController), "BookSchedule", operations),
    (typeof(ClassesController), "GetAllSchedules", schedules),
    (typeof(QLDACNTTNhom10.Controllers.TrainersController), "GetAllTrainers", operations),
    (typeof(QLDACNTTNhom10.Controllers.AiRetentionController), "GetRetentionStats", administration),
    (typeof(QLDACNTTNhom10.Controllers.AiRetentionController), "MarkAsHandled", operations)
};
foreach (var method in new[] { "CreatePackage", "UpdatePackage", "DeletePackage" })
    cases.Add((typeof(PackagesController), method, administration));
foreach (var method in new[] { "CreateClass", "CreateSchedule", "UpdateClass", "DeleteClass", "UpdateSchedule", "DeleteSchedule" })
    cases.Add((typeof(ClassesController), method, administration));
foreach (var method in new[] { "GetRevenueReport", "GetDashboardSummary", "ExportRevenueToExcel", "ExportMembersToExcel", "ImportMembersFromExcel" })
    cases.Add((typeof(QLDACNTTNhom10.Controllers.ReportsController), method, administration));
var checks = 0;
foreach (var item in cases)
{
    var method = item.Controller.GetMethod(item.Method) ?? throw new Exception($"Missing action {item.Method}");
    if (method.GetCustomAttribute<AllowAnonymousAttribute>() != null) throw new Exception("Unexpected anonymous action.");
    var metadata = item.Controller.GetCustomAttributes<AuthorizeAttribute>()
        .Concat(method.GetCustomAttributes<AuthorizeAttribute>());
    var policy = await AuthorizationPolicy.CombineAsync(policies, metadata)
        ?? throw new Exception("Missing authorization policy.");
    foreach (var role in new[] { "Admin", "Staff", "Trainer", "Member", "Anonymous" })
    {
        var principal = role == "Anonymous" ? new ClaimsPrincipal(new ClaimsIdentity())
            : new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.Role, role)], "test"));
        var result = await authorization.AuthorizeAsync(principal, null, policy);
        if (result.Succeeded != item.Roles.Contains(role))
            throw new Exception($"Incorrect authorization: {item.Controller.Name}.{item.Method}: {role}");
        checks++;
    }
}
Console.WriteLine($"Passed {checks} authorization checks. No actions executed, no SQL/AI/email calls.");
