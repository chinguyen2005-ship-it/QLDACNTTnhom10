using Microsoft.Extensions.DependencyInjection;

namespace QLDACNTTnhom10.Security;

public static class AccessPolicies
{
    public const string Administration = "Administration";
    public const string Operations = "Operations";
    public const string ScheduleRead = "ScheduleRead";

    public static IServiceCollection AddFitManageAuthorization(this IServiceCollection services)
    {
        return services.AddAuthorization(options =>
        {
            options.AddPolicy(Administration, policy => policy.RequireAuthenticatedUser().RequireRole("Admin"));
            options.AddPolicy(Operations, policy => policy.RequireAuthenticatedUser().RequireRole("Admin", "Staff"));
            options.AddPolicy(ScheduleRead, policy => policy.RequireAuthenticatedUser().RequireRole("Admin", "Staff", "Trainer", "Member"));
        });
    }
}
