using GradeMe3.Auth;
using GradeMe3.Courses;
using GradeMe3.Instructors;
using GradeMe3.Projects;
using GradeMe3.Students;
using GradeMe3.Teams;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorProject
{
    public class ProjectData
    {
        public Project Project { get; set; }
        public Course Course { get; set; }
        public List<StudentInProject> StudentsInProject { get; set; }
        public List<Student> Students { get; set; }
        public List<ApplicationUser> ApplicationUsers { get; set; }
        public List<Team> Teams { get; set; }
        public List<Instructor> Instructors { get; set; }
        public string ErrorMessage { get; set; }
    }
}
