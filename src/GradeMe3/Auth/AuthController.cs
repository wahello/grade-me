using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using GradeMe3.Database;

namespace GradeMe3.Auth
{
    [Route("api/[controller]")]
    public class AuthController: Controller
    {
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly ILogger _logger;
        private readonly JsonSerializerSettings _serializerSettings;

        public AuthController(IOptions<JwtIssuerOptions> jwtOptions, ILoggerFactory loggerFactory)
        {
            _jwtOptions = jwtOptions.Value;
            ThrowIfInvalidOptions(_jwtOptions);

            _logger = loggerFactory.CreateLogger<AuthController>();

            _serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                Formatting = Formatting.Indented
            };
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Get([FromBody] ApplicationUser applicationUser)
        {
            try
            {
                var identity = await Authenticate(applicationUser);
                if (identity == null)
                {
                    _logger.LogInformation($"Invalid username ({applicationUser.UserName}) or password ({applicationUser.Password})");
                    return new BadRequestObjectResult(new SignInResult()
                    {
                        ErrorMessage = "Invalid credentials"
                    });
                }

                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, applicationUser.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat,
                    ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(),
                    ClaimValueTypes.Integer64),
            };
                identity.ClaimsIdentity.AddClaims(claims);

                // Create the JWT security token and encode it.
                var jwt = new JwtSecurityToken(
                    issuer: _jwtOptions.Issuer,
                    audience: _jwtOptions.Audience,
                    claims: identity.ClaimsIdentity.Claims,
                    notBefore: _jwtOptions.NotBefore,
                    expires: _jwtOptions.Expiration,
                    signingCredentials: _jwtOptions.SigningCredentials);

                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

                identity.ApplicationUser.Password = ""; // Do not send the password back to the UI.

                // Serialize and return the response
                var response = new SignInResult()
                {
                    AccessToken = encodedJwt,
                    ExpiresIn = (int)_jwtOptions.ValidFor.TotalSeconds,
                    ApplicationUser = identity.ApplicationUser,
                    Roles = identity.Roles
                };

                // var json = JsonConvert.SerializeObject(response, _serializerSettings);
                // return new OkObjectResult(json);
                return new OkObjectResult(response);
            } catch (Exception exc)
            {
                return new BadRequestObjectResult(new SignInResult()
                {
                    ErrorMessage = "Failed to authenticate user " + exc.Message
                });
            }
        }

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }

        /// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
        private static long ToUnixEpochDate(DateTime date)
            => (long)Math.Round((date.ToUniversalTime() -
                                  new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                .TotalSeconds);

        private static Task<ApplicationUserIdentity> Authenticate(ApplicationUser user)
        {
            ApplicationUser knownUser;
            using (var db = new GradeMeContext())
            {
                knownUser = db.ApplicationUsers
                    .Include(x => x.Students)
                    .Include(x => x.Instructors)
                    .FirstOrDefault(x => x.UserName == user.UserName);
                if (null == knownUser)
                {
                    return Task.FromResult<ApplicationUserIdentity>(null);
                }
            }
            if (knownUser.Password != user.Password)
            {
                return Task.FromResult<ApplicationUserIdentity>(null);
            }
            var roles = new List<String>();
            var claims = new List<Claim>();
            claims.Add(new Claim("ApplicationUser", knownUser.Id));
            if (knownUser.IsAdministrator)
            {
                claims.Add(new Claim("Administrator", knownUser.Id));
                roles.Add("Administrator");
            }
            if (knownUser.IsInstructor)
            {
                claims.Add(new Claim("Instructor", knownUser.Id));
                roles.Add("Instructor");
            }
            if (knownUser.IsStudent)
            {
                claims.Add(new Claim("Student", knownUser.Id));
                roles.Add("Student");
            }
            return Task.FromResult(
                new ApplicationUserIdentity()
                {
                    ClaimsIdentity = new ClaimsIdentity(new GenericIdentity("ApplicationUser"), claims),
                    ApplicationUser = knownUser,
                    Roles = roles
                });
        }
    }
}