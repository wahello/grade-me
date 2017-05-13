using System.Collections.Generic;

namespace GradeMe3.Auth
{
    public class SignInResult
    {
        public string AccessToken { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int ExpiresIn { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public string ErrorMessage { get; set; }
    }
}