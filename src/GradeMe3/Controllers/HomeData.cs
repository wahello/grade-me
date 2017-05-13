using System.Collections.Generic;
using GradeMe3.Courses;

namespace GradeMe3.Controllers
{
    public class HomeData
    {
        public string ErrorMessage { get; set; }
        public List<Course> Courses { get; set; }
        public List<Course> InstructorCourses { get; set; }
        public List<Course> StudentCourses { get; set; }
        public List<Course> OtherCourses { get; set; }
    }
}