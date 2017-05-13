using System.Collections.Generic;
using GradeMe3.Auth;
using GradeMe3.Courses;
using GradeMe3.Evaluations;
using GradeMe3.Teams;
using Newtonsoft.Json;

namespace GradeMe3.Students
{
    public class Student
    {
        public string Id { get; set; }        
        public string CourseId { get; set; }
        public string ApplicationUserId { get; set; }
        [JsonIgnore]
        public List<StudentInProject> ProjectParticipation { get; set; }
        [JsonIgnore]
        public ApplicationUser ApplicationUser { get; set; }
        [JsonIgnore]
        public Course Course { get; set; }
        [JsonIgnore]
        public List<Evaluation> Evaluations { get; set; }
        [JsonIgnore]
        public List<Evaluation> EvaluationsByOthers { get; set; }
    }
}