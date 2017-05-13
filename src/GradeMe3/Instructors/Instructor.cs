using System.Collections.Generic;
using GradeMe3.Auth;
using GradeMe3.Courses;
using Newtonsoft.Json;

namespace GradeMe3.Instructors
{
    public class Instructor
    {
        public string Id { get; set; }        
        public string ApplicationUserId { get; set; }
        public string CourseId { get; set; }
        [JsonIgnore]
        public ApplicationUser ApplicationUser { get; set; }
        [JsonIgnore]
        public Course Course { get; set; }
    }
}