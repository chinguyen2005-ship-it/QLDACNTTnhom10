using System.ComponentModel.DataAnnotations;

namespace QLDACNTTnhom10.DTOs
{
    public class RegisterDto : IValidatableObject
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        [RegularExpression(@"[a-zA-Z0-9_.-]+")]
        public string Username { get; set; } = string.Empty;
        [Required]
        [StringLength(72, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        // Public registration always assigns Member on the server.
        public int RoleID { get; set; } = 4;
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        [Required]
        [RegularExpression(@"\+?[0-9 .()-]{8,20}")]
        public string Phone { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        [Required]
        [RegularExpression("^(Nam|Nữ|Khác)$")]
        public string Gender { get; set; } = "Khác";

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (System.Text.Encoding.UTF8.GetByteCount(Password ?? string.Empty) > 72)
                yield return new ValidationResult("Mật khẩu tối đa 72 byte.", new[] { nameof(Password) });
            if (DateOfBirth?.Date > DateTime.Today)
                yield return new ValidationResult("Ngày sinh không được ở tương lai.", new[] { nameof(DateOfBirth) });
        }
    }
}
