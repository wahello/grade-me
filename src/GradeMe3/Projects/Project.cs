using System.Collections.Generic;
using GradeMe3.Courses;
using GradeMe3.Evaluations;
using GradeMe3.Students;
using GradeMe3.Teams;
using Newtonsoft.Json;

namespace GradeMe3.Projects
{
    public class Project
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string EmailTemplate { get; set; }
        public string Status { get; set; }
        public string CourseId { get; set; }
        [JsonIgnore]
        public Course Course { get; set; }
        [JsonIgnore]
        public List<Evaluation> Evaluations { get; set; }
        [JsonIgnore]
        public List<Team> Teams { get; set; }
        [JsonIgnore]
        public List<StudentInProject> StudentsInProject { get; set; }
    }
}