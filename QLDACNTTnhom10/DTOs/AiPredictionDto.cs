namespace QLDACNTTnhom10.DTOs
{
    public class AiPredictionResponseDto
    {
        public int PredictionID { get; set; }
        public int MemberID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public int Age { get; set; }
        public int ContractID { get; set; }
        public string PackageName { get; set; } = string.Empty;
        public string PackageType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int DaysRemaining { get; set; }
        public int RemainingSessions { get; set; }
        public int TotalCheckInsLast30Days { get; set; }
        public int DaysSinceLastCheckIn { get; set; }
        public double RenewalProbability { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public string RetentionStrategy { get; set; } = string.Empty;
        public string SuggestedPromoCode { get; set; } = string.Empty;
        public bool IsHandled { get; set; }
        public DateTime PredictionDate { get; set; }
    }

    public class ContractFeatureDto
    {
        public int ContractID { get; set; }
        public int MemberID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public int Age { get; set; }
        public string PackageName { get; set; } = string.Empty;
        public string PackageType { get; set; } = string.Empty;
        public int DurationDays { get; set; }
        public decimal Price { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int DaysRemaining { get; set; }
        public int RemainingSessions { get; set; }
        public int CheckIns30Days { get; set; }
        public int DaysSinceLastCheckIn { get; set; }
    }

    public class GroqAiResultDto
    {
        public double RenewalProbability { get; set; }
        public string RiskLevel { get; set; } = "Medium";
        public string RetentionStrategy { get; set; } = string.Empty;
        public string SuggestedPromoCode { get; set; } = "AI_GIA_HAN_10";
    }

    public class AnalyzeRequestDto
    {
        public string? GroqApiKey { get; set; }
    }
}