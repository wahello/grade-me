using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore;
using GradeMe3.Database;
using Microsoft.EntityFrameworkCore;

namespace GradeMe3
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Moved to BuildWebHost for Core 2.0
            //var host = new WebHostBuilder()
            //    .UseKestrel()
            //    .UseContentRoot(Directory.GetCurrentDirectory())
            //    .UseIISIntegration()
            //    .UseStartup<Startup>()
            //    .Build();
            var host = BuildWebHost(args);

            using (var db = new GradeMeContext())
            {
                // db.Database.EnsureCreated();
                db.Database.Migrate();
                try
                {
                    var admin = db.ApplicationUsers.SingleOrDefault(x => x.UserName == "rustam");
                    if (null == admin)
                    {
                        db.SeedData();
                    }
                }
                catch (Exception exc)
                {
                }
            }

            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
        }
    }
}
