using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.StudentHome
{
    public class StudentTeammateInfo
    {
        public string StudentId { get; set; }
        public string ProjectId { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public double? Grade { get; set; }
        public string Justification { get; set; }
        public DateTime Time { get; set; }
    }
}
