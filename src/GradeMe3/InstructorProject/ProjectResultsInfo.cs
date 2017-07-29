using GradeMe3.Auth;
using GradeMe3.Evaluations;
using GradeMe3.Students;
using GradeMe3.Teams;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorProject
{
    public class ProjectResultsInfo
    {
        public List<StudentInProject> StudentsInProject { get; set; }
        public List<Student> Students { get; set; }
        public List<ApplicationUser> ApplicationUsers { get; set; }
        public List<Team> Teams { get; set; }
        public List<Evaluation> Evaluations { get; set; }
        public string ErrorMessage { get; set; }
    }
}
