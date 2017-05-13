using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.Auth
{
    public static class ControllerExtentions
    {
        public static string GetApplicationUserId(this Controller controller)
        {
            var userClaim = controller.User.Claims.FirstOrDefault(c => c.Type == "ApplicationUser");
            var userId = userClaim.Value;
            return userId;
        }
    }
}
