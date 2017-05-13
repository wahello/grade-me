using GradeMe3.Auth;
using GradeMe3.Courses;
using GradeMe3.Instructors;
using GradeMe3.Projects;
using GradeMe3.Students;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorCourse
{
    public class CourseData
    {
        public Course Course { get; set; }
        public List<Student> Students { get; set; }
        public List<Instructor> Instructors { get; set; }
        public List<Project> Projects { get; set; }
        public List<ApplicationUser> ApplicationUsers { get; set; }
        public string ErrorMessage { get; set; }
    }
}
