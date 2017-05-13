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

namespace GradeMe3.InstructorProject
{
    [Route("api/instructor-project")]
    public class InstructorProjectController : Controller
    {
        public InstructorProjectController()
        {
        }

        [HttpPost("fetch")]
        [AllowAnonymous]
        public IActionResult Fetch([FromBody] ProjectDataRequest request)
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
                    if (!user.IsAdministrator && !user.IsInstructor)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Nice try, student " + user.Name + "! Only administrators or instructors can get project data."
                        });
                    }
                    var reply = GetProjectData(db, user, request.ProjectId);
                    return new OkObjectResult(reply);
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }
        
        // Students

        [HttpPost("student-create")]
        [AllowAnonymous]
        public IActionResult StudentCreate([FromBody] StudentCreateRequest request)
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
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot add students."
                        });
                    }
                    var project = db.Projects.SingleOrDefault(p => p.Id == request.ProjectId);
                    if (null == project)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown project."
                        });
                    }
                    var course = db.Courses.Include(c => c.Students)
                        .SingleOrDefault(c => c.Id == project.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    var studentIds = course.Students.Select(s => s.Id);
                    var existingStudentsByUserId = db.Students
                        .Include(s => s.ApplicationUser)
                        .Where(s => studentIds.Contains(s.Id))
                        .ToDictionary(s => s.ApplicationUserId);
                    var capacity = request.Students.Count;                    
                    var userNames = request.Students.Select(x => x.ApplicationUser.UserName);                    
                    var existingUsersByUserName = db.ApplicationUsers
                                .Where(x => userNames.Contains(x.UserName))
                                .ToDictionary(x => x.UserName);

                    var users = new List<ApplicationUser>(capacity);
                    var students = new List<Student>(capacity);
                    var studentsInProject = new List<StudentInProject>(capacity);
                    var newTeamsByName = new Dictionary<string, Team>();
                    var existingTeamsByName = db.Teams.Where(t => t.ProjectId == project.Id)
                        .ToDictionary(t => t.Name);
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            // TODO prevent duplicate Students
                            // TODO reuse existing ApplicationUsers
                            foreach (var p in request.Students)
                            {
                                var student = p.Student;
                                var studentUser = p.ApplicationUser;
                                var studentInProject = p.StudentInProject;
                                var team = p.Team;
                                ApplicationUser existingUser;
                                string applicationUserId;                                
                                if (existingUsersByUserName.TryGetValue(studentUser.UserName, out existingUser))
                                {
                                    existingUser.Name = studentUser.Name;
                                    existingUser.Email = studentUser.Email;
                                    existingUser.Password = studentUser.Password;
                                    existingUser.IsStudent = true;
                                    applicationUserId = existingUser.Id;                                    
                                }
                                else
                                {
                                    studentUser.Id = Guid.NewGuid().ToString();
                                    applicationUserId = studentUser.Id;
                                    studentUser.IsStudent = true;
                                    users.Add(studentUser);
                                }
                                Student existingStudent;
                                string studentId;
                                if (existingStudentsByUserId.TryGetValue(applicationUserId, out existingStudent))
                                {
                                    studentId = existingStudent.Id;
                                }
                                else
                                {
                                    studentId = student.Id = Guid.NewGuid().ToString();
                                    student.CourseId = course.Id;
                                    student.ApplicationUserId = applicationUserId;
                                    students.Add(student);
                                }
                                Team existingTeam;
                                string teamId;
                                if (existingTeamsByName.TryGetValue(team.Name, out existingTeam))
                                {
                                    teamId = existingTeam.Id;
                                } else
                                {
                                    if (newTeamsByName.TryGetValue(team.Name, out existingTeam))
                                    {
                                        teamId = existingTeam.Id;
                                    } else
                                    {
                                        teamId = team.Id = Guid.NewGuid().ToString();
                                        team.ProjectId = project.Id;
                                        newTeamsByName.Add(team.Name, team);
                                    }                                    
                                }
                                studentInProject.StudentId = studentId;
                                studentInProject.ProjectId = project.Id;
                                studentInProject.Id = Guid.NewGuid().ToString();
                                studentInProject.TeamId = teamId;
                                studentsInProject.Add(studentInProject);                                
                            }
                            db.ApplicationUsers.AddRange(users);
                            db.Students.AddRange(students);
                            db.Teams.AddRange(newTeamsByName.Values);
                            db.StudentsInProject.AddRange(studentsInProject);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetProjectData(db, user, project.Id);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(transExc);
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        [HttpPost("student-update")]
        [AllowAnonymous]
        public IActionResult StudentUpdate([FromBody] StudentCreateRequest request)
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
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot update student records."
                        });
                    }
                    var project = db.Projects.SingleOrDefault(p => p.Id == request.ProjectId);
                    if (null == project)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown project."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == project.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    var users = new List<ApplicationUser>(request.Students.Count);
                    var existingTeamsByName = db.Teams.Where(t => t.ProjectId == project.Id)
                        .ToDictionary(t => t.Name);
                    var newTeamsByName = new Dictionary<string, Team>();
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {                            
                            foreach (var p in request.Students)
                            {
                                var userUpdate = p.ApplicationUser;
                                var teamUpdate = p.Team;
                                var studentInProjectUpdate = p.StudentInProject;

                                var studentUser = db.ApplicationUsers
                                    .SingleOrDefault(u => u.Id == userUpdate.Id);
                                studentUser.Name = userUpdate.Name;
                                studentUser.Password = userUpdate.Password;
                                studentUser.UserName = userUpdate.UserName;
                                studentUser.Email = userUpdate.Email;
                                users.Add(studentUser);
                                var studentInProject = db.StudentsInProject
                                    .SingleOrDefault(x => x.Id == studentInProjectUpdate.Id);
                                Team existingTeam;
                                if (existingTeamsByName.TryGetValue(teamUpdate.Name, out existingTeam) ||
                                    newTeamsByName.TryGetValue(teamUpdate.Name, out existingTeam))
                                {
                                    studentInProject.TeamId = existingTeam.Id;
                                } else
                                {
                                    studentInProject.TeamId = teamUpdate.Id = Guid.NewGuid().ToString();
                                    newTeamsByName.Add(teamUpdate.Name, teamUpdate);
                                }
                            }
                            db.Teams.AddRange(newTeamsByName.Values);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetProjectData(db, user, project.Id);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(transExc);
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        [HttpPost("student-delete")]
        [AllowAnonymous]
        public IActionResult StudentDelete([FromBody] StudentDeleteRequest request)
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
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot delete students."
                        });
                    }
                    var project = db.Projects.SingleOrDefault(p => p.Id == request.ProjectId);
                    if (null == project)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown project."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == project.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var studentsInProject = db.StudentsInProject
                                .Where(s => request.StudentInProjectIds.Contains(s.Id))
                                .ToList();
                            db.StudentsInProject.RemoveRange(studentsInProject);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetProjectData(db, user, request.ProjectId);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(transExc);
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        // Teams

        [HttpPost("team-create")]
        [AllowAnonymous]
        public IActionResult TeamCreate([FromBody] TeamCreateRequest request)
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
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot create teams."
                        });
                    }
                    var project = db.Projects.SingleOrDefault(p => p.Id == request.ProjectId);
                    if (null == project)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown project."
                        });
                    }
                    var teamNames = request.Teams.Select(x => x.Name);
                    var existingTeams = db.Teams.Where(t => teamNames.Contains(t.Name));
                    if (existingTeams.Any())
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Teams already exist: " +
                                string.Join(",", existingTeams.Select(x => x.Name))
                        });
                    }
                    var teams = request.Teams.Select(t => new Team()
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = t.Name,
                        ProjectId = project.Id,
                        Description = t.Description
                    });
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            // TODO prevent duplicate Students
                            // TODO reuse existing ApplicationUsers                            
                            db.Teams.AddRange(teams);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetProjectData(db, user, project.Id);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(transExc);
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        [HttpPost("team-update")]
        [AllowAnonymous]
        public IActionResult TeamUpdate([FromBody] TeamCreateRequest request)
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
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot update teams."
                        });
                    }
                    var project = db.Projects.SingleOrDefault(p => p.Id == request.ProjectId);
                    if (null == project)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown project."
                        });
                    }
                    var teamsById = request.Teams.ToDictionary(x => x.Id);                    
                    var existingTeams = db.Teams.Where(x => teamsById.Keys.Contains(x.Id));                    
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            foreach (var t in existingTeams)
                            {
                                var u = teamsById[t.Id];
                                t.Name = u.Name;
                                t.Description = u.Description;
                            }                            
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetProjectData(db, user, project.Id);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(transExc);
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        [HttpPost("team-delete")]
        [AllowAnonymous]
        public IActionResult TeamDelete([FromBody] TeamDeleteRequest request)
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
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot delete teams."
                        });
                    }
                    var project = db.Projects.SingleOrDefault(p => p.Id == request.ProjectId);
                    if (null == project)
                    {
                        return new BadRequestObjectResult(new ProjectData()
                        {
                            ErrorMessage = "Unknown project."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var teams = db.Teams
                                .Where(x => request.TeamIds.Contains(x.Id));
                            db.Teams.RemoveRange(teams);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetProjectData(db, user, request.ProjectId);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(transExc);
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        private ProjectData GetProjectData(GradeMeContext db, ApplicationUser user, string ProjectId)
        {
            var reply = new ProjectData();

            var project = db.Projects
                .Include(p => p.Course)
                .Include(p => p.StudentsInProject)
                .SingleOrDefault(p => p.Id == ProjectId);
            if (null == project)
            {
                return new ProjectData()
                {
                    ErrorMessage = "Unknown project"
                };
            }
            var course = db.Courses
                .Include(c => c.Instructors)
                .Include(c => c.Students)
                .SingleOrDefault(c => c.Id == project.CourseId);            
            if (null == course)
            {
                return new ProjectData()
                {
                    ErrorMessage = "Unknown course"
                };
            }
            var studentIds = project.StudentsInProject.Select(x => x.StudentId);
            var students = db.Students
                .Include(s => s.ApplicationUser)
                .Where(s => studentIds.Contains(s.Id));
            var teams = db.Teams.Where(t => t.ProjectId == ProjectId);
            var instructors = course.Instructors;
            var userIds = students.Select(s => s.ApplicationUserId);
            var applicationUsers = db.ApplicationUsers;
            return new ProjectData()
            {
                Project = project,
                Course = course,
                StudentsInProject = project.StudentsInProject,
                Students = students.ToList(),
                Instructors = instructors.ToList(),
                ApplicationUsers = applicationUsers.ToList(),
                Teams = teams.ToList()
            };
        }
    }
}