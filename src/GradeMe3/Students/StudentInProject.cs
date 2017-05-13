using System.Collections.Generic;
using GradeMe3.Auth;
using GradeMe3.Courses;
using GradeMe3.Evaluations;
using GradeMe3.Projects;
using GradeMe3.Teams;
using Newtonsoft.Json;

namespace GradeMe3.Students
{
    public class StudentInProject
    {
        public string Id { get; set; }
        public string ProjectId { get; set; }
        public string StudentId { get; set; }
        public string TeamId { get; set; }               
        [JsonIgnore]
        public Team Team { get; set; }
        [JsonIgnore]
        public Student Student { get; set; }
        [JsonIgnore]
        public Project Project { get; set; }        
    }
}