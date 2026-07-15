using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using dotnetapp.Models;

namespace dotnetapp;

public class Shop
{
    [Key]
    public int? productId{ get; set; }
    [Required]
    public string? productName { get; set; }

    public string? description { get; set; }
    
    public int? price{ get; set; }

    public int? UserId{ get; set; }

    [JsonIgnore]
    public User? user{ get; set; }
    
}