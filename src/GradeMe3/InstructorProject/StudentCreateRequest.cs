using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorProject
{
    public class StudentCreateRequest
    {
        public string ProjectId { get; set; }
        public List<ProjectStudentTuple> Students { get; set; }
    }
}
