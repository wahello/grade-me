using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace GradeMe3.Auth
{
    public class InstructorRequirement : AuthorizationHandler<InstructorRequirement>, IAuthorizationRequirement
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            InstructorRequirement requirement)
        {
            var claims = context.User.Claims.ToList();

            if (context.User.HasClaim(c => c.Type == GradeMePolicies.Administrator) ||
                context.User.HasClaim(c => c.Type == GradeMePolicies.Instructor))
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }
            return Task.CompletedTask;
        }
    }
}