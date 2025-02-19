using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class User
    {
        [Key]
        public int? UserId { get; set; }
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }
        [Required]
        public string? UserRole { get; set; }
        
    }
}