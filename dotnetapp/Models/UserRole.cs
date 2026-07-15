using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class UserRoles
    {
        [Key]
        public int? RoleId { get; set; }
        public const string? Admin = "Admin";
        public const string? User = "User";
    }
}