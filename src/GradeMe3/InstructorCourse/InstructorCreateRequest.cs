using GradeMe3.Auth;
using GradeMe3.Instructors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorCourse
{
    public class InstructorCreateRequest
    {        
        public string CourseId { get; set; }
        public List<Tuple<Instructor, ApplicationUser>> Instructors { get; set; }
    }
}
