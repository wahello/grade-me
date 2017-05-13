using System.Collections.Generic;
using GradeMe3.Database;
using GradeMe3.Instructors;
using GradeMe3.Projects;
using GradeMe3.Students;
using Newtonsoft.Json;

namespace GradeMe3.Courses
{
    public class Course: IPk
    {
        public string Id { get; set; }
        public string Name { get; set; }
        //public DateTime CreationTime { get; set; }
        public string Description { get; set; }
        [JsonIgnore]
        public List<Instructor> Instructors { get; set; }
        [JsonIgnore]
        public List<Student> Students { get; set; }
        [JsonIgnore]
        public List<Project> Projects { get; set; }
    }
}