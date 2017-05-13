using GradeMe3.Projects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorCourse
{
    public class ProjectCreateRequest
    {        
        public string CourseId { get; set; }
        public List<Project> Projects { get; set; }
    }
}
