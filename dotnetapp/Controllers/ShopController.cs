using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using dotnetapp.Data;
using dotnetapp.Exceptions;
namespace dotnetapp.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {

        private readonly ShopService _shopService;
        private readonly ApplicationDbContext _context;
        public ShopController(ShopService shopService, ApplicationDbContext context)
        {
            _shopService = shopService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shop>>> GetAllProducts()
        {

            try
            {   
                var shops = await _shopService.getAllProducts();
                return Ok(shops);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.Message);

            }
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<Shop>> GetProductsById(int productId)
        {
            try
            {
                var product = await _shopService.getProductsbyProductId(productId);
                if (product == null)
                {
                    return NotFound("Product not found.");
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Shop>>> GetProductsByUserId(int userId)
        {
            try
            {
                var product = await _shopService.getProductsByUserId(userId);
                if (product == null || !product.Any())
                {
                    return NotFound("No Products found for this user");
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddProduct([FromBody] Shop product)
        {
            try
            {
                await _shopService.addProduct(product);
                return Ok("Product added successfully");
            }
             catch (ProductException pex)
            {
                return StatusCode(500, pex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{productId}")]
        public async Task<ActionResult> UpdateProduct(int productId, [FromBody] Shop product)
        {
            try
            {
                var result = await _shopService.updateProduct(productId, product);
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

        [HttpDelete("{productId}")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            try
            {
                var result = await _shopService.deleteProduct(productId);
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

    }
}