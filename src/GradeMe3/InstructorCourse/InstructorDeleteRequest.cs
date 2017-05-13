using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorCourse
{
    public class InstructorDeleteRequest
    {
        public string CourseId { get; set; }
        public List<string> InstructorIds { get; set; }
    }
}
