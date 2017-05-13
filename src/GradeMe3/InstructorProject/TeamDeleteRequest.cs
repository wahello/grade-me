using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorProject
{
    public class TeamDeleteRequest
    {
        public string ProjectId { get; set; }
        public List<string> TeamIds { get; set; }
    }
}
