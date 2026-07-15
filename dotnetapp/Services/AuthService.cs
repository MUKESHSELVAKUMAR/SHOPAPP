using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using dotnetapp.Models;
using Microsoft.IdentityModel.Tokens;
using dotnetapp.Data;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<(int, string)> Registration(User model)
        {
            if(model?.Email == null) 
            { 
                return (0, "Email cannot be null.");
            }

            var foundUser = await _userManager.FindByEmailAsync(model.Email);
            if (foundUser != null)
            {
                Console.WriteLine("Email already in use.");
                return (0, "Email already in use.");
            }

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _roleManager.CreateAsync(new IdentityRole(model.UserRole));
                await _userManager.AddToRoleAsync(user, model.UserRole);
                var customUser = new User
                {
                    Username = model.Username,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    Password = model.Password,
                    UserRole = model.UserRole
                };

                _context.Users.Add(customUser);
                await _context.SaveChangesAsync();
                return (1, "User created successfully!");
            }
            else if (result.Errors.Any(e => e.Code == "DuplicateUserName"))
            {
                return (0, "User already exists");
            }
            return (0, "User creation failed! Please check user details and try again.");
        }

        public async Task<(int, string)> Login(LoginModel model)
        {
            Console.WriteLine(model.Email);
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                Console.WriteLine("Invalid email");
                return (0, "Invalid email");
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var customUser = _context.Users.FirstOrDefault(u => u.Email == model.Email);
                var role = await _userManager.GetRolesAsync(user);
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, customUser.UserId.ToString()),
                    new Claim(ClaimTypes.Role, role.FirstOrDefault())
                };

                var token = GenerateToken(claims);
                return (1, token);
            }
            return (0, "Invalid password");
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}