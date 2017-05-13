using GradeMe3.Teams;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.InstructorProject
{
    public class TeamCreateRequest
    {
        public string ProjectId { get; set; }
        public List<Team> Teams { get; set; }
    }
}
