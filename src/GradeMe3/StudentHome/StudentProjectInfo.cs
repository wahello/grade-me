using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.StudentHome
{
    public class StudentProjectInfo
    {
        public string ProjectId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string TeamName { get; set; }
        public string TeamDescription { get; set; }
        public List<StudentTeammateInfo> Teammates { get; set; }
    }
}
