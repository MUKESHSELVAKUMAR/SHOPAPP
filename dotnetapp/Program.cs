using dotnetapp.Data;
using dotnetapp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Identity.Web;
using System.Text;
using dotnetapp.Models;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.SignalR;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// builder.Services.AddDbContext<ApplicationDbContext>(o=>o.UseSqlServer(builder.Configuration.GetConnectionString("conn")));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("conn"), sqlOptions =>
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(15),
            errorNumbersToAdd: null
        )
    )
);

builder.Services.AddTransient<ShopService>();
builder.Services.AddTransient<CartService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMvc()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);
builder.Services.AddCors(OperationStatus=>{
    OperationStatus.AddDefaultPolicy(builder=>{
        builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
    });
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
 
    // Define the BearerAuth scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"  // Must be lowercase
    });
 
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthentication()
    .AddMicrosoftIdentityWebApi(
        options =>
        {
            builder.Configuration.Bind("AzureAd", options);
 
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                    {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            };
        },
        options => builder.Configuration.Bind("AzureAd", options),
        jwtBearerScheme: "AzureAd"
    );

// builder.Services.AddDistributedMemoryCache();

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.ConnectionMultiplexerFactory = async () =>
    {
        var redisEndpoint = builder.Configuration["Redis:Endpoint"];
        Console.WriteLine(redisEndpoint);
        var configOptions = new ConfigurationOptions
        {
            EndPoints = { redisEndpoint },
            Ssl = true,
            AbortOnConnectFail = false
        };
 
        await configOptions.ConfigureForAzureWithSystemAssignedManagedIdentityAsync();
 
        return await ConnectionMultiplexer.ConnectAsync(configOptions);
    };
});

builder.Services.AddSingleton(sp =>
{
    var fullyQualifiedNamespace = builder.Configuration["ServiceBus:Namespace"];
    return new ServiceBusClient(fullyQualifiedNamespace, new DefaultAzureCredential());
});

builder.Services.AddSignalR().AddStackExchangeRedis(options =>
{
    options.ConnectionFactory = async writer =>
    {
        var config = new ConfigurationOptions
        {
            EndPoints = { builder.Configuration["Redis:Endpoint"] },
            Ssl = true,
            AbortOnConnectFail = false
        };
        await config.ConfigureForAzureWithSystemAssignedManagedIdentityAsync();
        var connection = await ConnectionMultiplexer.ConnectAsync(config, writer);
        return connection;
    };
});

builder.Services.AddHostedService<ProductEventConsumer>();

var app = builder.Build();

app.Logger.LogInformation("JWT Key value (TEST ONLY): {Key}", app.Configuration["Jwt:Key"]);

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(
"AllowSpecificOrigin"
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

if (app.Environment.IsDevelopment())
{
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty;  // Set Swagger UI at apps root
});
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors();
app.MapControllers();

app.MapHub<ProductHub>("/hubs/products").RequireAuthorization(new AuthorizeAttribute { AuthenticationSchemes = "AzureAd" });

app.MapFallbackToFile("index.html");

app.Run();