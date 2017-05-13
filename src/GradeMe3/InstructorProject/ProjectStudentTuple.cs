using GradeMe3.Auth;
using GradeMe3.Students;
using GradeMe3.Teams;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorProject
{
    public class ProjectStudentTuple
    {
        public StudentInProject StudentInProject { get; set; }
        public Student Student { get; set; }
        public ApplicationUser ApplicationUser {get;set;}
        public Team Team { get; set; }
    }
}
