// Services/ContractExpiryBackgroundService.cs
// TASK-373: BackgroundService chạy lúc 8:00 sáng mỗi ngày
// Định kỳ gọi IContractExpiryService để quét DB và gửi email nhắc hết hạn.
namespace QLDACNTTnhom10.Services;

public class ContractExpiryBackgroundService : BackgroundService
{
    // Chạy lúc 8:00 sáng mỗi ngày
    private static readonly TimeOnly RunAt = new(8, 0, 0);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ContractExpiryBackgroundService> _logger;

    public ContractExpiryBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<ContractExpiryBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger       = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "[ExpiryJob] 🟢 ContractExpiryBackgroundService đã khởi động. Lịch quét hàng ngày: {RunAt}",
            RunAt);

        while (!stoppingToken.IsCancellationRequested)
        {
            var now     = DateTime.Now;
            var nextRun = DateTime.Today.Add(RunAt.ToTimeSpan());
            if (now >= nextRun) nextRun = nextRun.AddDays(1);

            var delay = nextRun - now;
            _logger.LogInformation(
                "[ExpiryJob] ⏳ Đợt quét tiếp theo lúc {NextRun:dd/MM/yyyy HH:mm} (sau {H}h {M}m)",
                nextRun, (int)delay.TotalHours, delay.Minutes);

            try
            {
                await Task.Delay(delay, stoppingToken);

                // Tạo Scoped Service để gọi IContractExpiryService
                using var scope = _scopeFactory.CreateScope();
                var scanner = scope.ServiceProvider.GetRequiredService<IContractExpiryService>();
                var result = await scanner.ScanAndSendRemindersAsync(stoppingToken);

                _logger.LogInformation(
                    "[ExpiryJob] 🎯 Kết quả quét: Tổng={Total}, Thành công={Success}, Thất bại={Failed}",
                    result.TotalFound, result.SuccessCount, result.FailedCount);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("[ExpiryJob] 🔴 Nhận tín hiệu dừng dịch vụ (Shutdown).");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ExpiryJob] ❌ Lỗi không xác định trong quá trình quét tự động.");
                // Chờ 5 phút trước khi thử lại để tránh loop lỗi liên tục
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }

        _logger.LogInformation("[ExpiryJob] 🔴 ContractExpiryBackgroundService đã dừng.");
    }
}
