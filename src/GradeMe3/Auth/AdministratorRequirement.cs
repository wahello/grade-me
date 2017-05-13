using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Linq;


namespace GradeMe3.Auth
{
    public class AdministratorRequirement : AuthorizationHandler<AdministratorRequirement>, IAuthorizationRequirement
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            AdministratorRequirement requirement)
        {
            var claims = context.User.Claims.ToList();

            if (context.User.HasClaim(c => c.Type == GradeMePolicies.Administrator))
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