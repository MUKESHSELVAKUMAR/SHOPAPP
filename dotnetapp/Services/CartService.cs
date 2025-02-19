using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    public class CartService
    {
        private readonly ApplicationDbContext _context;
 
        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }
 
        public async Task<Cart?> getProductsbyProductId(int productId)
        {

            return await _context.Carts.FindAsync(productId);            
        }


        public async Task<bool> addProductToCart(Cart product)
        {
            var user = await _context.Users.FindAsync(product.UserId);
 
            if (user == null)
            {
                return false; 
            }
 
            product.user = user;

            await _context.Carts.AddAsync(product);
            await _context.SaveChangesAsync();
 
            return true;
        }

        public async Task<IEnumerable<Cart>> getCartByUserId(int userId)
        {
            return await _context.Carts.Where(c => c.UserId == userId).Include(c => c.user).ToListAsync();
        }

        public async Task<bool> updateCart(int cartId, Cart cart)
        {
            var existingCart = await _context.Carts.FindAsync(cartId);
            if (existingCart == null)
            {
                return false;
            }
            existingCart.productName=cart.productName;
            existingCart.description=cart.description;
            existingCart.price=cart.price;
            existingCart.quantity = cart.quantity;
            _context.Carts.Update(existingCart);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> deleteProduct(int cartId)
        {
           
            var product = await _context.Carts.FindAsync(cartId);
            if (product == null)
            {
                return false;
            }

            _context.Carts.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> deleteCart(int productId)
        {

            var cart = _context.Carts.FirstOrDefault(p => p.productId == productId);
            if (cart == null)
            {
                return false;
            }
            _context.Carts.Remove(cart);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> clearCart(int userId)
        {
           
            var carts = await _context.Carts.Where(c => c.UserId == userId).Include(c => c.user).ToListAsync();
            if (!carts.Any())
            {
                return false;
            }

            _context.Carts.RemoveRange(carts);
            await _context.SaveChangesAsync();
            return true;
        }
    }    

}