using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class ShopService
    {
        private readonly ApplicationDbContext _context;
 
        public ShopService(ApplicationDbContext context)
        {
            _context = context;
        }
 
        public async Task<IEnumerable<Shop>> getAllProducts()
        {
            return await _context.Shops.ToListAsync();
        }
 
        public async Task<Shop?> getProductsbyProductId(int productId)
        {

            return await _context.Shops.FindAsync(productId);            
        }

        public async Task<IEnumerable<Shop>> getProductsByUserId(int userId)
        {
            return await _context.Shops.Where(f => f.UserId == userId).Include(f=>f.user).ToListAsync();
        }
 
        public async Task<bool> addProduct(Shop product)
        {
            var exists=await _context.Shops.AnyAsync(r=>r.productName==product.productName);
            
            if(exists){
                throw new ProductException("A product with the title already exists");
        
            }

            await _context.Shops.AddAsync(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> updateProduct(int productId,Shop product)
        {

            var existingProduct = await _context.Shops.FindAsync(productId);
            if (existingProduct == null)
            {
                return false;
            }
 
            existingProduct.productName = product.productName;
            existingProduct.description = product.description;
            existingProduct.price = product.price;
            
            await _context.SaveChangesAsync();
            return true;
        }
 
        public async Task<bool> deleteProduct(int productId)
        {
           
            var product = await _context.Shops.FindAsync(productId);
            if (product == null)
            {
                return false;
            }
            _context.Shops.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}