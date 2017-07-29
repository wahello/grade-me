using System;
using System.Collections.Generic;
using GradeMe3.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using GradeMe3.Auth;
using GradeMe3.Courses;
using GradeMe3.Instructors;
using Microsoft.EntityFrameworkCore;
using GradeMe3.Students;
using GradeMe3.Teams;
using System.Text;
using GradeMe3.Evaluations;

namespace GradeMe3.StudentHome
{
    [Route("api/student-home")]
    public class StudentHomeController : Controller
    {
        public StudentHomeController()
        {
        }

        [HttpPost("fetch")]
        [Authorize(Policy = GradeMePolicies.Student)]
        public IActionResult Fetch([FromBody] StudentHomeRequest request)
        {
            try
            {
                using (var db = new GradeMeContext())
                {
                    var userId = this.GetApplicationUserId();
                    var user = db.ApplicationUsers
                        .Include(x => x.Students)
                        .Include(x => x.Instructors)
                        .FirstOrDefault(x => x.Id == userId);
                    if (null == user)
                    {
                        return new UnauthorizedResult();
                    }                    
                    var reply = GetHomeInfo(db, user);
                    return new OkObjectResult(reply);
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        [HttpPost("evaluation-create")]
        [Authorize(Policy = GradeMePolicies.Student)]
        public IActionResult EvaluationCreate([FromBody] EvaluationCreateRequest request)
        {
            try
            {
                using (var db = new GradeMeContext())
                {
                    var userId = this.GetApplicationUserId();
                    var user = db.ApplicationUsers
                        .Include(x => x.Instructors)
                        .FirstOrDefault(x => x.Id == userId);
                    if (null == user)
                    {
                        return new UnauthorizedResult();
                    }
                    var students = db.Students.Where(x => x.ApplicationUserId == userId);
                    var studentIds = students.Select(x => x.Id);
                    var courseIds = students.Select(x => x.CourseId);
                    var courses = db.Courses.Where(x => courseIds.Contains(x.Id));                    
                    var evaluations = request.Evaluations;
                    var projectIds = evaluations.Select(x => x.ProjectId).Distinct();
                    var projects = db.Projects.Where(x => projectIds.Contains(x.Id));
                    var studentsInProjects = db.StudentsInProject
                        .Where(x => studentIds.Contains(x.StudentId) && projectIds.Contains(x.ProjectId));
                    var studentIdByProjectId = studentsInProjects
                        .ToDictionary(x => x.ProjectId, x => x.StudentId);
                    var now = DateTime.Now;
                    foreach (var e in evaluations)
                    {
                        e.Id = Guid.NewGuid().ToString();
                        e.EvaluatorStudentId = studentIdByProjectId[e.ProjectId];
                        e.Time = now;
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            db.Evaluations.AddRange(evaluations);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetHomeInfo(db, user);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(transExc);
                        }
                    }
                }
            } catch(Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        private Evaluation LatestEvaluation(IEnumerable<Evaluation> evaluations)
        {
            var list = evaluations.ToList();
            list.Sort((a, b) => b.Time.CompareTo(a.Time));
            return list.FirstOrDefault();
        }

        private StudentHomeInfo GetHomeInfo(GradeMeContext db, ApplicationUser user)
        {
            var reply = new StudentHomeInfo();

            var students = db.Students.Where(s => s.ApplicationUserId == user.Id);
            var studentIds = students.Select(s => s.Id);
            var studentsInProjects = db.StudentsInProject.Where(x => studentIds.Contains(x.StudentId));
            var projectIds = studentsInProjects.Select(x => x.ProjectId);
            var projects = db.Projects.Where(p => projectIds.Contains(p.Id));
            var teamIds = studentsInProjects.Select(x => x.TeamId);
            var teams = db.Teams.Where(x => teamIds.Contains(x.Id));
            var otherStudentsInProjects = db.StudentsInProject.Where(x => teamIds.Contains(x.TeamId));
            var otherStudentIds = otherStudentsInProjects.Select(x => x.StudentId).Distinct();
            var otherStudents = db.Students.Where(x => otherStudentIds.Contains(x.Id));
            var otherUserIds = otherStudents.Select(x => x.ApplicationUserId).Distinct();
            var otherUsers = db.ApplicationUsers.Where(x => otherUserIds.Contains(x.Id));

            var teamsByProjectId = teams.ToDictionary(x => x.ProjectId);
            var otherStudentsInProjectsByProjectId = otherStudentsInProjects
                .GroupBy(x => x.ProjectId)
                .ToDictionary(x => x.Key, x => x.ToList());
            var otherStudentsById = otherStudents.ToDictionary(x => x.Id);
            var otherUsersById = otherUsers.ToDictionary(x => x.Id);
            var evaluations = db.Evaluations
                .Where(x => studentIds.Contains(x.EvaluatorStudentId))
                .GroupBy(x => x.ProjectId)
                .ToDictionary(
                    x => x.Key,
                    x => x.GroupBy(e => e.EvaluatedStudentId)
                        .ToDictionary(e => e.Key, e => LatestEvaluation(e)));

            var projectInfos = projects.Select(proj => new StudentProjectInfo()
            {
                ProjectId = proj.Id,
                Name = proj.Name,
                Description = proj.Description,
                Status = proj.Status
            }).ToList();

            foreach(var p in projectInfos)
            {
                var team = teamsByProjectId[p.ProjectId];                
                var teammates = otherStudentsInProjectsByProjectId[p.ProjectId].Select(sp => {
                    var otherStudent = otherStudentsById[sp.StudentId];
                    var otherUser = otherUsersById[otherStudent.ApplicationUserId];
                    var teammateInfo = new StudentTeammateInfo()
                    {
                        StudentId = otherStudent.Id,
                        ProjectId = p.ProjectId,
                        Name = otherUser.Name,
                        UserName = otherUser.UserName                        
                    };
                    Evaluation evaluation = null;
                    Dictionary<string, Evaluation> projectEvaluations = null;
                    if (evaluations.TryGetValue(p.ProjectId, out projectEvaluations) &&
                        projectEvaluations.TryGetValue(otherStudent.Id, out evaluation))
                    {
                        teammateInfo.Grade = evaluation.Grade;
                        teammateInfo.Justification = evaluation.Justification;
                        teammateInfo.Time = evaluation.Time;
                    }
                    return teammateInfo;
                }).ToList();
                p.TeamDescription = team.Description;
                p.TeamName = team.Name;
                p.Teammates = teammates;
            }

            return new StudentHomeInfo()
            {
                Projects = projectInfos
            };
        }
    }
}