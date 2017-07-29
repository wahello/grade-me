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

namespace GradeMe3.InstructorCourse
{
    [Route("api/instructor-course")]
    public class InstructorCourseController : Controller
    {
        public InstructorCourseController()
        {
        }

        [HttpPost("fetch")]
        [Authorize(Policy = GradeMePolicies.Instructor)]
        public IActionResult Fetch([FromBody] CourseDataRequest request)
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Nice try, student " + user.Name + "! Only administrators or instructors can get course data."
                        });
                    }
                    var reply = GetCourseData(db, user, request.CourseId);
                    return new OkObjectResult(reply);
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        // Projects

        [HttpPost("project-create")]
        [Authorize(Policy = GradeMePolicies.Instructor)]
        public IActionResult ProjectCreate([FromBody] ProjectCreateRequest request)
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot create projects."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            request.Projects = request.Projects.Select(x =>
                            {
                                if (null == x.Id)
                                {
                                    x.Id = Guid.NewGuid().ToString();
                                    x.CourseId = course.Id;
                                }
                                return x;
                            }).ToList();
                            db.Projects.AddRange(request.Projects);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, course.Id);
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

        [HttpPost("project-update")]
        [Authorize(Policy = GradeMePolicies.Instructor)]
        public IActionResult ProjectUpdate([FromBody] ProjectCreateRequest request)
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot update projects."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            request.Projects = request.Projects.Select(x =>
                            {
                                if (null == x.Id)
                                {
                                    x.Id = Guid.NewGuid().ToString();
                                    x.CourseId = course.Id;
                                }
                                return x;
                            }).ToList();
                            var updatesById = request.Projects.ToDictionary(p => p.Id);
                            var projects = db.Projects.Where(p => updatesById.ContainsKey(p.Id)).ToList();
                            foreach (var project in projects)
                            {
                                var update = updatesById[project.Id];
                                project.Name = update.Name;
                                project.Description = update.Description;
                                project.EmailTemplate = update.EmailTemplate;
                                project.Status = update.Status;
                            }
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, course.Id);
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

        [HttpPost("project-delete")]
        [Authorize(Policy = GradeMePolicies.Instructor)]
        public IActionResult ProjectDelete([FromBody] ProjectDeleteRequest request)
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot delete projects."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var projects = db.Projects.Where(p => request.ProjectIds.Contains(p.Id)).ToList();
                            db.Projects.RemoveRange(projects);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, request.CourseId);
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

        // Students

        [HttpPost("student-create")]            
        [Authorize(Policy = GradeMePolicies.Instructor)]
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot add students."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            // TODO prevent duplicate Students
                            // TODO reuse existing ApplicationUsers
                            var users = new List<ApplicationUser>(request.Students.Count);
                            var userNames = request.Students.Select(x => x.Item2.UserName);
                            var students = new List<Student>(request.Students.Count);
                            var existingUsersByUserName = db.ApplicationUsers
                                .Where(x => userNames.Contains(x.UserName))
                                .ToDictionary(x => x.UserName);
                            foreach(var p in request.Students)
                            {
                                var student = p.Item1;
                                var studentUser = p.Item2;
                                ApplicationUser existingUser;
                                string applicationUserId;
                                if (existingUsersByUserName.TryGetValue(studentUser.UserName, out existingUser)) {
                                    existingUser.Name = studentUser.Name;
                                    existingUser.Email = studentUser.Email;
                                    existingUser.Password = studentUser.Password;
                                    existingUser.IsStudent = true;
                                    applicationUserId = existingUser.Id;
                                } else
                                {
                                    studentUser.Id = Guid.NewGuid().ToString();
                                    applicationUserId = studentUser.Id;
                                    studentUser.IsStudent = true;
                                    users.Add(studentUser);
                                }
                                student.ApplicationUserId = applicationUserId;
                                student.Id = Guid.NewGuid().ToString();
                                student.CourseId = request.CourseId;                                
                                students.Add(student);
                            }
                            db.ApplicationUsers.AddRange(users);
                            db.Students.AddRange(students);                            
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, course.Id);
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
        [Authorize(Policy = GradeMePolicies.Instructor)]
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot update student records."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var users = new List<ApplicationUser>(request.Students.Count);
                            var students = new List<Student>(request.Students.Count);
                            foreach (var p in request.Students)
                            {
                                var studentUpdate = p.Item1;
                                var studentUserUpdate = p.Item2;
                                var student = db.Students.SingleOrDefault(s => s.Id == studentUpdate.Id);
                                var studentUser = db.ApplicationUsers.SingleOrDefault(u => u.Id == studentUserUpdate.Id);
                                studentUser.Name = studentUserUpdate.Name;
                                studentUser.Password = studentUserUpdate.Password;
                                studentUser.UserName = studentUserUpdate.UserName;
                                studentUser.Email = studentUserUpdate.Email;
                                users.Add(studentUser);
                                students.Add(student);                                
                            }
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, course.Id);
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
        [Authorize(Policy = GradeMePolicies.Instructor)]
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot delete projects."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var students = db.Students.Where(s => request.StudentIds.Contains(s.Id)).ToList();
                            var userIds = students.Select(s => s.ApplicationUserId).ToList();                            
                            db.Students.RemoveRange(students);
                            db.SaveChanges();
                            IEnumerable<ApplicationUser> users = db.ApplicationUsers
                                .Include(u => u.Students)
                                .Include(u => u.Instructors);
                            users = users.Where(u => userIds.Contains(u.Id) &&
                                u.Students.Count == 0 &&
                                u.Instructors.Count == 0 &&
                                !u.IsAdministrator);
                            db.ApplicationUsers.RemoveRange(users);                            
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, request.CourseId);
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

        // Instructors
        [HttpPost("instructor-create")]
        [Authorize(Policy = GradeMePolicies.Instructor)]
        public IActionResult InstructorCreate([FromBody] InstructorCreateRequest request)
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot add instructors."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            // TODO prevent duplicate Instructors
                            // TODO reuse existing ApplicationUsers
                            var users = new List<ApplicationUser>(request.Instructors.Count);
                            var instructors = new List<Instructor>(request.Instructors.Count);
                            foreach (var p in request.Instructors)
                            {
                                var instructor = p.Item1;
                                var instructorUser = p.Item2;
                                instructorUser.Id = Guid.NewGuid().ToString();
                                instructor.ApplicationUserId = instructorUser.Id;
                                instructor.Id = Guid.NewGuid().ToString();
                                instructor.CourseId = request.CourseId;
                                instructorUser.IsInstructor = true;
                                users.Add(instructorUser);
                                instructors.Add(instructor);
                            }
                            db.ApplicationUsers.AddRange(users);
                            db.Instructors.AddRange(instructors);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, course.Id);
                            return new OkObjectResult(reply);
                        }
                        catch (Exception transExc)
                        {
                            transaction.Rollback();
                            return new BadRequestObjectResult(new CourseData()
                            {
                                ErrorMessage = "Failed to add instructor.\n" + transExc.Message
                            });
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        [HttpPost("instructor-update")]
        [Authorize(Policy = GradeMePolicies.Instructor)]
        public IActionResult InstructorUpdate([FromBody] InstructorCreateRequest request)
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot update student records."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var users = new List<ApplicationUser>(request.Instructors.Count);
                            var instructors = new List<Instructor>(request.Instructors.Count);
                            foreach (var p in request.Instructors)
                            {
                                var iUpdate = p.Item1;
                                var uUpdate = p.Item2;
                                var inst = db.Instructors.SingleOrDefault(s => s.Id == iUpdate.Id);
                                var us = db.ApplicationUsers.SingleOrDefault(u => u.Id == uUpdate.Id);
                                us.Name = uUpdate.Name;
                                us.Password = uUpdate.Password;
                                us.UserName = uUpdate.UserName;
                                us.Email = uUpdate.Email;
                                users.Add(us);
                                instructors.Add(inst);
                            }
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, course.Id);
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

        [HttpPost("instructor-delete")]
        [Authorize(Policy = GradeMePolicies.Instructor)]
        public IActionResult InstructorDelete([FromBody] InstructorDeleteRequest request)
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
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot delete projects."
                        });
                    }
                    var course = db.Courses.SingleOrDefault(c => c.Id == request.CourseId);
                    if (course == null)
                    {
                        return new BadRequestObjectResult(new CourseData()
                        {
                            ErrorMessage = "Unknown course."
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var instructors = db.Instructors.Where(x => request.InstructorIds.Contains(x.Id)).ToList();
                            var userIds = instructors.Select(s => s.ApplicationUserId).ToList();
                            db.Instructors.RemoveRange(instructors);
                            db.SaveChanges();
                            IEnumerable<ApplicationUser> users = db.ApplicationUsers
                                .Include(u => u.Students)
                                .Include(u => u.Instructors);
                            users = users.Where(u => userIds.Contains(u.Id) &&
                                u.Students.Count == 0 &&
                                u.Instructors.Count == 0 &&
                                !u.IsAdministrator);
                            db.ApplicationUsers.RemoveRange(users);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetCourseData(db, user, request.CourseId);
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

        private CourseData GetCourseData(GradeMeContext db, ApplicationUser user, string CourseId)
        {
            var reply = new CourseData();

            var course = db.Courses
                .Include(c => c.Projects)
                .Include(c => c.Students)
                .Include(c => c.Instructors)
                .SingleOrDefault(c => c.Id == CourseId);            
            if (null == course)
            {
                return new CourseData()
                {
                    ErrorMessage = "Unknown course"
                };
            }
            var userIds = course.Students.Select(s => s.ApplicationUserId);
            userIds = userIds.Concat(course.Instructors.Select(i => i.ApplicationUserId));
            userIds = userIds.Distinct();
            var applicationUsers = db.ApplicationUsers.Where(u => userIds.Contains(u.Id)).ToList();
            return new CourseData()
            {
                Course = course,
                Projects = course.Projects.ToList(),
                Students = course.Students.ToList(),
                Instructors = course.Instructors.ToList(),
                ApplicationUsers = applicationUsers
            };
        }
    }
}