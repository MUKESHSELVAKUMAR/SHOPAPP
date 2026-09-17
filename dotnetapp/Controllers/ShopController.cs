using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using dotnetapp.Data;
using dotnetapp.Exceptions;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Authorization;
using Azure.Messaging.ServiceBus;

namespace dotnetapp.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {

        private readonly ShopService _shopService;
        private readonly ApplicationDbContext _context;
        private readonly IDistributedCache _cache;
        private readonly ILogger<ShopController> _logger;
        private readonly ServiceBusSender _sender;

        public ShopController(ShopService shopService, ApplicationDbContext context, IDistributedCache cache, ILogger<ShopController> logger, ServiceBusClient sbClient)
        {
            _shopService = shopService;
            _context = context;
            _cache = cache;
            _logger = logger;
            _sender = sbClient.CreateSender("product-events");
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
                string cacheKey = $"product-{userId}";
                var cached = await _cache.GetStringAsync(cacheKey);
                if (cached != null)
                {
                    var instanceId = Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID");
                    _logger.LogInformation("CACHE HIT for key: {CacheKey} on instance {InstanceId}", cacheKey, instanceId);
                    return Ok(JsonSerializer.Deserialize<List<Shop>>(cached));
                }
        
                _logger.LogInformation("CACHE MISS for key: {CacheKey} — querying database", cacheKey);
                var product = await _shopService.getProductsByUserId(userId);
                if (product == null || !product.Any())
                {
                    return NotFound("No Products found for this user");
                }
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(product),
                    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
        
                _logger.LogInformation("CACHE POPULATED for key: {CacheKey}", cacheKey);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("admin")]
        [Authorize(AuthenticationSchemes = "AzureAd", Roles = "Admin")]
        public async Task<ActionResult> AddProduct([FromBody] Shop product)
        {
            try
            {
                await _shopService.addProduct(product);
        
                string cacheKey = $"product-{product.UserId}";
                await _cache.RemoveAsync(cacheKey);
                _logger.LogInformation("CACHE INVALIDATED for key: {CacheKey} after add", cacheKey);
        
                var evt = new { EventType = "ProductAdded", product.productId, product.productName, Timestamp = DateTime.UtcNow };
                await _sender.SendMessageAsync(new ServiceBusMessage(JsonSerializer.Serialize(evt))
                {
                    ContentType = "application/json",
                    Subject = "ProductAdded"
                });
                _logger.LogInformation("Published ProductAdded event for productId {ProductId}", product.productId);
        
                return Ok("Product added successfully");
            }
            catch (ProductException pex) { return StatusCode(500, pex.Message); }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        [HttpPut("{productId}")]
        public async Task<ActionResult> UpdateProduct(int productId, [FromBody] Shop product)
        {
            try
            {
                var result = await _shopService.updateProduct(productId, product);
                if (!result) return NotFound("Product not found");
        
                // Closes the cache invalidation gap — remove stale cached entry
                string cacheKey = $"product-{product.UserId}";
                await _cache.RemoveAsync(cacheKey);
                _logger.LogInformation("CACHE INVALIDATED for key: {CacheKey} after update", cacheKey);
        
                var evt = new { EventType = "ProductUpdated", productId, Timestamp = DateTime.UtcNow };
                await _sender.SendMessageAsync(new ServiceBusMessage(JsonSerializer.Serialize(evt))
                {
                    ContentType = "application/json",
                    Subject = "ProductUpdated"
                });
        
                return Ok("Product updated successfully");
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
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