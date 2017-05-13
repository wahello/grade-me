using GradeMe3.Auth;
using GradeMe3.Students;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorCourse
{
    public class StudentCreateRequest
    {
        public string CourseId { get; set; }
        public List<Tuple<Student, ApplicationUser>> Students { get; set; }        
    }
}
