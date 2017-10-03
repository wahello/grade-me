using System.IO;
using GradeMe3.Auth;
using GradeMe3.Courses;
using GradeMe3.Emails;
using GradeMe3.Evaluations;
using GradeMe3.Instructors;
using GradeMe3.Projects;
using GradeMe3.Students;
using GradeMe3.Teams;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.PlatformAbstractions;
using GradeMe3.InstructorProject;

namespace GradeMe3.Database
{
    public class GradeMeContext : DbContext
    {
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Project> Projects { set; get; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentInProject> StudentsInProject { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Mailbox> Mailboxes { get; set; }
        public DbSet<EvaluationApproval> EvaluationApprovals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>()
                .HasIndex(u => u.UserName)
                .IsUnique();

            modelBuilder.Entity<Student>()
                .HasOne(x => x.ApplicationUser)
                .WithMany(x => x.Students)
                .HasForeignKey(x => x.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            modelBuilder.Entity<Student>()
                .HasIndex(s => new { s.ApplicationUserId, s.CourseId })
                .IsUnique();

            modelBuilder.Entity<Instructor>()
                .HasOne(x => x.ApplicationUser)
                .WithMany(x => x.Instructors)
                .HasForeignKey(x => x.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            modelBuilder.Entity<Instructor>()
                .HasIndex(i => new { i.ApplicationUserId, i.CourseId })
                .IsUnique();

            modelBuilder.Entity<Student>()
                .HasOne(x => x.Course)
                .WithMany(x => x.Students)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Instructor>()
                .HasOne(x => x.Course)
                .WithMany(x => x.Instructors)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasOne(x => x.Course)
                .WithMany(x => x.Projects)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasIndex(p => new { p.Name, p.CourseId })
                .IsUnique();

            modelBuilder.Entity<Team>()
                .HasOne(x => x.Project)
                .WithMany(x => x.Teams)
                .HasForeignKey(x => x.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Team>()
                .HasIndex(t => new { t.ProjectId, t.Name })
                .IsUnique();

            modelBuilder.Entity<StudentInProject>()
                .HasOne(x => x.Project)
                .WithMany(x => x.StudentsInProject)
                .HasForeignKey(x => x.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Should a student be allowed to participate in multiple teams in the same project?
            modelBuilder.Entity<StudentInProject>()
                .HasIndex(sp => new { sp.ProjectId, sp.StudentId })
                .IsUnique();

            // When a team is deleted should the students be removed from the project or their team set to null?
            modelBuilder.Entity<StudentInProject>()
                .HasOne(x => x.Team)
                .WithMany(x => x.Members)
                .HasForeignKey(x => x.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentInProject>()
                .HasOne(x => x.Student)
                .WithMany(x => x.ProjectParticipation)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Evaluation>()
                .HasOne(x => x.EvaluatorStudent)
                .WithMany(x => x.Evaluations)
                .HasForeignKey(x => x.EvaluatorStudentId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Evaluation>()
                .HasOne(x => x.EvaluatedStudent)
                .WithMany(x => x.EvaluationsByOthers)
                .HasForeignKey(x => x.EvaluatedStudentId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Evaluation>()
                .HasOne(x => x.Project)
                .WithMany(x => x.Evaluations)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EvaluationApproval>()
                .HasOne(x => x.Instructor)
                .WithMany(x => x.Approvals)
                .HasForeignKey(x => x.InstructorId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var path = PlatformServices.Default.Application.ApplicationBasePath;
            var connection = $"Filename={Path.Combine(path, "GradeMe3.db")}";
            optionsBuilder.UseSqlite(connection);
        }
    }
}