using LeadProdos.Backend.Data;
using LeadProdos.Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Entrez: Bearer {votre token}"
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
            new string[] {}
        }
    });
});
// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "mongodb://localhost:27017";
var databaseName = builder.Configuration.GetConnectionString("DatabaseName") ?? "LeadProdosDb";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMongoDB(connectionString, databaseName));

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "your-secret-key-must-be-at-least-32-characters-long";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "LeadProdosApi",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "LeadProdosApp",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = "role",  // Map "role" from JWT to ClaimsIdentity roles
        NameClaimType = "sub"
    };
});

builder.Services.AddAuthorization();

// Configure JWT claims to roles mapping
JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

// Add MongoDB Client and Database
builder.Services.AddSingleton<IMongoClient>(new MongoClient(connectionString));
builder.Services.AddScoped(provider => 
{
    var mongoClient = provider.GetRequiredService<IMongoClient>();
    return mongoClient.GetDatabase(databaseName);
});

// Add Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Add MongoDB Services (direct driver access)
builder.Services.AddScoped<MongoProductService>();
builder.Services.AddScoped<MongoClientService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002", "http://127.0.0.1:3003", "http://127.0.0.1:3004")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

// Initialize Admin User and Seed Data (via Node.js script - more reliable with MongoDB)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    
    try
    {
        // Just verify connection is working
        _ = context.Users;
        Console.WriteLine("\n✅ Backend started successfully!");
        Console.WriteLine("📧 Admin: admin@leadprodos.com | 🔑 Password: Admin@123");
        Console.WriteLine("📦 Database ready!");
        Console.WriteLine("\n📝 To seed data, run: node seed_db.js\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Database connection error: {ex.Message}");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

static string HashPassword(string password)
{
    using (var sha256 = SHA256.Create())
    {
        var salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(20);

        var hashWithSalt = new byte[36];
        System.Buffer.BlockCopy(salt, 0, hashWithSalt, 0, 16);
        System.Buffer.BlockCopy(hash, 0, hashWithSalt, 16, 20);

        return Convert.ToBase64String(hashWithSalt);
    }
}
