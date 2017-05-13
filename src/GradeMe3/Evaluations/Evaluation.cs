using System;
using GradeMe3.Projects;
using GradeMe3.Students;
using Newtonsoft.Json;

namespace GradeMe3.Evaluations
{
    public class Evaluation
    {
        public string Id { get; set; }
        public DateTime Time { get; set; }
        public string EvaluatorStudentId { get; set; }
        public string ProjectId { get; set; }
        public string EvaluatedStudentId { get; set; }

        public int Grade { get; set; }
        public string Justification { get; set; }

        [JsonIgnore]
        public Student EvaluatorStudent { get; set; }        
        [JsonIgnore]
        public Student EvaluatedStudent { get; set; }        
        [JsonIgnore]
        public Project Project { get; set; }        
    }
}