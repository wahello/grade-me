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

namespace GradeMe3.Controllers
{    
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        public HomeController()
        {
        }

        [HttpPost("fetch-all")]
        [AllowAnonymous]
        public IActionResult HomeFetchAll([FromBody] UserDataRequest request)
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
                        return new BadRequestObjectResult(new HomeData()
                        {
                            ErrorMessage = "Unknown User"
                        });
                    }
                    var reply = GetHomeData(db, user);
                    return new OkObjectResult(reply);
                }
            }
            catch (Exception exc)
            {
                return new BadRequestObjectResult(exc);
            }
        }

        private HomeData GetHomeData(GradeMeContext db, ApplicationUser user)
        {
            var reply = new HomeData();
            var userCourses = new List<Course>();
            if (user.IsInstructor)
            {
                var courses = db.Courses.Include(x => x.Instructors).ToList();
                courses = courses
                    .Where(c => c.Instructors.ToList().Exists(i => i.ApplicationUserId == user.Id))
                    .ToList();
                reply.InstructorCourses = courses;
                userCourses.AddRange(courses);
            }
            if (user.IsStudent)
            {
                var courses = db.Courses.Include(x => x.Students).ToList();
                courses = courses
                    .Where(c => c.Students.ToList().Exists(s => s.ApplicationUserId == user.Id))
                    .ToList();
                reply.StudentCourses = courses;
                userCourses.AddRange(courses);
            }
            if (user.IsAdministrator)
            {
                var courses = db.Courses.ToList();
                reply.Courses = courses;
                userCourses.AddRange(courses);
            }
            reply.OtherCourses = db.Courses.ToList()
                .Except(userCourses, new IdComparer<Course>())
                .ToList();
            return reply;
        }

        [HttpPost("course-add")]
        [AllowAnonymous]
        public IActionResult CourseAdd([FromBody] CourseAddRequest request)
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
                        return new BadRequestObjectResult(new HomeData()
                        {
                            ErrorMessage = "Unknown User"
                        });
                    }
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new HomeData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot add courses"
                        });
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            request.Courses = request.Courses.Select(x =>
                            {
                                if (null == x.Id)
                                {
                                    x.Id = Guid.NewGuid().ToString();
                                }
                                return x;
                            }).ToList();
                            db.Courses.AddRange(request.Courses);
                            // If the user adding courses is an instructor then add him as instructor to all new courses
                            if (user.IsInstructor)
                            {
                                var instructors = request.Courses.Select(x => new Instructor()
                                {
                                    Id = Guid.NewGuid().ToString(),
                                    ApplicationUserId = user.Id,
                                    CourseId = x.Id
                                });
                                db.Instructors.AddRange(instructors);
                            }
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetHomeData(db, user);
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

        [HttpPost("course-remove")]
        [AllowAnonymous]
        public IActionResult CourseRemove([FromBody] CourseRemoveRequest request)
        {
            try
            {
                using (var db = new GradeMeContext())
                {
                    var userId = this.GetApplicationUserId();
                    var user = db.ApplicationUsers
                                .FirstOrDefault(x => x.Id == userId);
                    if (null == user)
                    {
                        return new BadRequestObjectResult(new HomeData()
                        {
                            ErrorMessage = "Unknown User"
                        });
                    }
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new HomeData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot remove courses"
                        });
                    }
                    var courses = db.Courses.Include(c => c.Instructors)
                        .Where(c => request.CourseIds.Contains(c.Id))                        
                        .ToList();
                    // User can remove courses where he is an instructor
                    if (user.IsAdministrator)
                    {
                        courses = courses.Where(c => c.Instructors.Exists(i => i.ApplicationUserId == user.Id)).ToList();
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            db.Courses.RemoveRange(courses);
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetHomeData(db, user);
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

        [HttpPost("course-update")]
        [AllowAnonymous]
        public IActionResult CourseUpdate([FromBody] CourseAddRequest request)
        {
            try
            {
                using (var db = new GradeMeContext())
                {
                    var userId = this.GetApplicationUserId();
                    var user = db.ApplicationUsers
                                .FirstOrDefault(x => x.Id == userId);
                    if (null == user)
                    {
                        return new BadRequestObjectResult(new HomeData()
                        {
                            ErrorMessage = "Unknown User"
                        });
                    }
                    if (!user.IsInstructor && !user.IsAdministrator)
                    {
                        return new BadRequestObjectResult(new HomeData()
                        {
                            ErrorMessage = "The user is neither instructor nor administrator and cannot update courses"
                        });
                    }
                    var updatesById = request.Courses.ToDictionary(x => x.Id);
                    var courses = db.Courses.Include(c => c.Instructors)
                        .Where(c => updatesById.ContainsKey(c.Id))
                        .ToList();
                    // User can only modify courses where he is an instructor
                    if (!user.IsAdministrator)
                    {
                        courses = courses.Where(c => c.Instructors.Exists(i => i.ApplicationUserId == user.Id)).ToList();
                    }
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            foreach (var c in courses)
                            {
                                var u = updatesById[c.Id];
                                c.Name = u.Name;
                                c.Description = u.Description;
                            }                            
                            db.SaveChanges();
                            transaction.Commit();
                            var reply = GetHomeData(db, user);
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
    }
}