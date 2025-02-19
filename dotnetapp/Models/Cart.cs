using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace dotnetapp.Models
{
    public class Cart
    {
        [Key]
        public int? cartId { get; set; }
        [Required]
        
        public int? productId { get; set; }

        public string? productName { get; set; }

        public string? description { get; set; }

        public int? price{ get; set; }

        public int? quantity{ get; set; }
        
        public int? UserId{ get; set; }
        
        [JsonIgnore]
        public User? user{ get; set; }

    }
}