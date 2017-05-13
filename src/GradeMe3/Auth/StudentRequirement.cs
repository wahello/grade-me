using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace GradeMe3.Auth
{
    public class StudentRequirement : AuthorizationHandler<StudentRequirement>, IAuthorizationRequirement
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            StudentRequirement requirement)
        {
            if (context.User.HasClaim(c => c.Type == GradeMePolicies.Administrator) ||
                context.User.HasClaim(c => c.Type == GradeMePolicies.Student))
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