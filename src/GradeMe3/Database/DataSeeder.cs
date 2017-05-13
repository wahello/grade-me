using GradeMe3.Auth;

namespace GradeMe3.Database
{
    public static class DataSeeder
    {
        public static void SeedData(this GradeMeContext db)
        {
            var rustamUser = new ApplicationUser()
            {
                Id = "B35551D8-57B3-4EBA-AC64-1CE020FEFCEC",
                Name = "Rustam Arazov",
                UserName = "rustam",
                Password = "312",
                IsAdministrator = true,
                IsInstructor = true,
                IsStudent = true
            };            
            db.ApplicationUsers.Add(rustamUser);            
            db.SaveChanges();
        }
    }
}