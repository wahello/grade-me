using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using GradeMe3.Instructors;

namespace GradeMe3.InstructorProject
{
    public class EvaluationApproval
    {
        public string Id { get; set; }
        public string EvaluationId { get; set; }
        public double Approval { get; set; }
        public string InstructorId { get; set; }
        [JsonIgnore]
        public Instructor Instructor { get; set; }
    }
}
