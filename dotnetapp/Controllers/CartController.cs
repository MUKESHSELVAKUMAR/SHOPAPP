using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using dotnetapp.Data;
using dotnetapp.Models;
namespace dotnetapp.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {

        private readonly CartService _cartService;

        private readonly ShopService _shopService;
        private readonly ApplicationDbContext _context;

        public CartController(CartService cartService, ShopService shopService, ApplicationDbContext context)
        {
            _cartService = cartService;
            _shopService = shopService;
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> AddProductToCart([FromBody] Cart product) {
        try {
            
            await _cartService.addProductToCart(product);
            return Ok("Product added to cart successfully");

        } catch (Exception ex) {

            return StatusCode(500, ex.Message);
            
        }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCartsByUserId(int userId)
        {
            try
            {
                var cart = await _cartService.getCartByUserId(userId);
                if (cart == null || !cart.Any())
                {
                    return NotFound("No Products found for this user");
                }
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{cartId}")]
        public async Task<ActionResult> UpdateCart(int cartId, [FromBody] Cart cart)
        {
            try
            {
                var result = await _cartService.updateCart(cartId, cart);
                if (!result)
                {
                    return NotFound("Product not found");
                }
                return Ok("Product updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }    

        [HttpDelete("{cartId}")]
        public async Task<ActionResult> DeleteProduct(int cartId)
        {
            try
            {
                var result = await _cartService.deleteProduct(cartId);
                if (!result)
                {
                    return NotFound("Product not found");
                }
                return Ok("Product deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("product/{productId}")]
        public async Task<ActionResult> DeleteCart(int productId)
        {
            try
            {
                var result = await _cartService.deleteCart(productId);
                if (!result)
                {
                    return NotFound("Product not found");
                }
                return Ok("Product deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
        try {
            
            await _cartService.clearCart(userId);
            return Ok("Cart cleared successfully");

        } catch (Exception ex) {

            return StatusCode(500, ex.Message);
            
        }
        }

    }
}