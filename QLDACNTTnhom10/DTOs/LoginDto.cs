using System.ComponentModel.DataAnnotations;

namespace QLDACNTTnhom10.DTOs
{
    public class LoginDto
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;
        [Required]
        [StringLength(72)]
        public string Password { get; set; } = string.Empty;
    }
}
