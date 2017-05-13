using System.Collections.Generic;

namespace GradeMe3.Controllers
{
    public class CourseRemoveRequest
    {
        public string ApplicationUserId { get; set; } 
        public List<string> CourseIds { get; set; }
    }
}