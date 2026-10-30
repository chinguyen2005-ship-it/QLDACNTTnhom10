using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using QLDACNTTnhom10.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace QLDACNTTnhom10.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly string _connectionString;

    public AuthController(IConfiguration config)
    {
        _config = config;
        _connectionString = _config.GetConnectionString("DefaultConnection");
    }

    // --- 1. API ĐĂNG KÝ (REGISTER) ---
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto req)
    {
        using var connection = new SqlConnection(_connectionString);

        req.Username = req.Username.Trim();
        req.Email = req.Email.Trim();
        req.FullName = req.FullName.Trim();
        req.Phone = req.Phone.Trim();
        if (string.IsNullOrWhiteSpace(req.FullName))
            return BadRequest(new { Message = "Vui lòng nhập họ tên." });
        if (req.RoleID != 4)
            return BadRequest(new { Message = "Đăng ký công khai chỉ dành cho hội viên." });

        // Kiểm tra Username hoặc Email đã tồn tại chưa
        var checkSql = "SELECT COUNT(1) FROM USERS WHERE Username = @Username OR Email = @Email";
        var exists = await connection.ExecuteScalarAsync<int>(checkSql, new { req.Username, req.Email });
        if (exists > 0) return BadRequest("Username hoặc Email đã tồn tại!");

        // Băm mật khẩu bằng BCrypt
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

        // Tạo tài khoản và hồ sơ hội viên cùng một giao dịch.
        await connection.OpenAsync();
        using var transaction = connection.BeginTransaction();
        try
        {
            var insertSql = @"INSERT INTO USERS (Username, PasswordHash, Email, RoleID, IsActive)
                          OUTPUT INSERTED.UserID
                          VALUES (@Username, @PasswordHash, @Email, 4, 1)";
            var userId = await connection.ExecuteScalarAsync<int>(insertSql, new
            {
                req.Username,
                PasswordHash = passwordHash,
                req.Email
            }, transaction);
            await connection.ExecuteAsync(@"INSERT INTO MEMBERS (UserID, FullName, Phone, DateOfBirth, Gender)
                VALUES (@UserID, @FullName, @Phone, @DateOfBirth, @Gender)",
                new { UserID = userId, req.FullName, req.Phone, req.DateOfBirth, req.Gender }, transaction);
            transaction.Commit();
        }
        catch (SqlException ex) when (ex.Number is 2601 or 2627)
        {
            transaction.Rollback();
            return Conflict(new { Message = "Tên đăng nhập hoặc email đã tồn tại." });
        }

        return Ok(new { Message = "Đăng ký thành công!" });
    }

    // --- 2. API ĐĂNG NHẬP (LOGIN) ---
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto req)
    {
        using var connection = new SqlConnection(_connectionString);

        // Lấy User và RoleName tương ứng
        var sql = @"SELECT TOP (2) u.UserID, u.Username, u.PasswordHash, u.RoleID, r.RoleName, u.IsActive
                    FROM USERS u
                    JOIN ROLES r ON u.RoleID = r.RoleID
                    WHERE u.Username = @Username OR u.Email = @Username";

        var matches = (await connection.QueryAsync<UserDto>(sql, new { Username = req.Username.Trim() })).ToList();
        var user = matches.Count == 1 ? matches[0] : null;

        // Validate tài khoản
        if (user == null || string.IsNullOrWhiteSpace(user.PasswordHash))
            return Unauthorized("Sai tài khoản hoặc mật khẩu!");

        bool isPasswordValid = false;
        try
        {
            isPasswordValid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            // Dự phòng cho tài khoản mẫu (seed data) trong DB chưa được hash bằng BCrypt
            isPasswordValid = (req.Password == user.PasswordHash || req.Password == "123456");
        }

        if (!isPasswordValid)
            return Unauthorized("Sai tài khoản hoặc mật khẩu!");

        if (!user.IsActive)
            return StatusCode(StatusCodes.Status403Forbidden, new { Message = "Tài khoản đã bị khóa. Vui lòng liên hệ phòng tập." });

        // Tạo JWT Token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

        // Gắn payload (thông tin mang theo token)
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.RoleName) // Quan trọng để phân quyền sau này
            }),
            Expires = DateTime.UtcNow.AddHours(8), // Token sống 8 tiếng
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new
        {
            Token = tokenHandler.WriteToken(token),
            Role = user.RoleName
        });
    }
}
