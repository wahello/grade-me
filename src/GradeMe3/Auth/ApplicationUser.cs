using GradeMe3.Instructors;
using GradeMe3.Students;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace GradeMe3.Auth
{
    public class ApplicationUser
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public bool IsInstructor { get; set; }
        public bool IsAdministrator { get; set; }
        public bool IsStudent { get; set; }
        [JsonIgnore]
        public List<Student> Students { get; set; }
        [JsonIgnore]
        public List<Instructor> Instructors { get; set; }        
    }
}