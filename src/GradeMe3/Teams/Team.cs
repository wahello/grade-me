using System.Collections.Generic;
using GradeMe3.Projects;
using GradeMe3.Students;
using Newtonsoft.Json;

namespace GradeMe3.Teams
{
    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ProjectId { get; set; }
        [JsonIgnore]
        public List<StudentInProject> Members { get; set; }
        [JsonIgnore]
        public Project Project { get; set; }
    }
}