using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorCourse
{
    public class ProjectDeleteRequest
    {
        public string CourseId { get; set; } // To return updated CourseData
        public List<string> ProjectIds { get; set; }
    }
}
