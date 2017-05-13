using System.Collections.Generic;
using GradeMe3.Courses;

namespace GradeMe3.Controllers
{
    public class CourseAddRequest
    {
        public string ApplicationUserId { get; set; } 
        public List<Course> Courses { get; set; }
    }
}