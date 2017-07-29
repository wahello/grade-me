using System.Collections.Generic;
using GradeMe3.Courses;

namespace GradeMe3.Controllers
{
    public class HomeData
    {
        public string ErrorMessage { get; set; }
        public List<Course> Courses { get; set; }        
    }
}