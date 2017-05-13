using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace GradeMe3.Auth
{
    public class ApplicationUserIdentity
    {
        public ClaimsIdentity ClaimsIdentity { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public List<String> Roles { get; set; }
    }
}