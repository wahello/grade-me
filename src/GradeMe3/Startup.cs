using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GradeMe3.Auth;
using GradeMe3.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace GradeMe3
{
    public class Startup
    {
        //TODO get this from environment
        private static readonly string SecretKey = "C88A22FB-F81C-43A7-A59D-7D8079D56BDD";
        private readonly SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));


        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsEnvironment("Development"))
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            // Moved to Program.Main
            //using (var db = new GradeMeContext())
            //{
            //    db.Database.EnsureCreated();
            //    try
            //    {
            //        var admin = db.ApplicationUsers.SingleOrDefault(x => x.UserName == "rustam");
            //        if (null == admin)
            //        {
            //            db.SeedData();
            //        }                    
            //    }
            //    catch (Exception exc)
            //    {                    
            //    }
            //}

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry(Configuration);
            services.AddEntityFrameworkSqlite().AddDbContext<GradeMeContext>();

            services.AddMvc(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                config.Filters.Add(new AuthorizeFilter(policy));
            }).AddJsonOptions(options =>
            {
                //    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                //    options.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.None;
            });

            services.AddRouting();
            services.AddOptions();

            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));

            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                        ValidateAudience = true,
                        ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = _signingKey,

                        RequireExpirationTime = true,
                        ValidateLifetime = true,

                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(
                    GradeMePolicies.Administrator,
                    policy => policy.RequireClaim(GradeMePolicies.Administrator));
                options.AddPolicy(
                    GradeMePolicies.Student,
                    policy => policy.Requirements.Add(new StudentRequirement()));
                options.AddPolicy(
                    GradeMePolicies.Instructor,
                    policy => policy.Requirements.Add(new InstructorRequirement()));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            //var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
            //var tokenValidationParameters = new TokenValidationParameters
            //{
            //    ValidateIssuer = true,
            //    ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

            //    ValidateAudience = true,
            //    ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

            //    ValidateIssuerSigningKey = true,
            //    IssuerSigningKey = _signingKey,

            //    RequireExpirationTime = true,
            //    ValidateLifetime = true,

            //    ClockSkew = TimeSpan.Zero
            //};
            //app.UseApplicationInsightsRequestTelemetry();
            //app.UseApplicationInsightsExceptionTelemetry();
            //app.UseJwtBearerAuthentication(new JwtBearerOptions
            //{
            //    TokenValidationParameters = tokenValidationParameters
            //});
            app.UseStaticFiles();
            app.UseMvc();
            app.UseDefaultFiles();
            app.UseAuthentication();
            
            // For ReactJS application to work index.html needs to be served on all paths except /api/*
            var routeBuilder = new RouteBuilder(app);
            routeBuilder.MapGet("{*path}", context => context.Response.SendFileAsync(@"wwwroot\index.html"));
            var routes = routeBuilder.Build();
            app.UseRouter(routes);
        }
    }
}
