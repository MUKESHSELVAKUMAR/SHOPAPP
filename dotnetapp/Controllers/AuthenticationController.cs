using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Handles user login requests.
        /// </summary>
        /// <param name="model">The login model containing email and password.</param>
        /// <returns>A JWT token if the login is successful.</returns>
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid login request.");
            }

            var (statusCode, responseMessage) = await _authService.Login(model);

            if (statusCode == 1)
            {
                return Ok(new { token = responseMessage });
            }

            return Unauthorized(responseMessage);
        }

        /// <summary>
        /// Handles user registration requests.
        /// </summary>
        /// <param name="model">The user model containing registration details.</param>
        /// <returns>A success message if the registration is successful.</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid registration request.");
            }

            var (statusCode, responseMessage) = await _authService.Registration(model, model.UserRole);

            Console.WriteLine(statusCode);
            Console.WriteLine(responseMessage);
            if (statusCode == 1)
            {
                return Ok(new { message = responseMessage });
            }
            Console.WriteLine(responseMessage);

            return BadRequest(responseMessage);
        }
    }
}