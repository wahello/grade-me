﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using GradeMe3.Database;

namespace GradeMe3.Migrations
{
    [DbContext(typeof(GradeMeContext))]
    [Migration("20170511163839_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1");

            modelBuilder.Entity("GradeMe3.Auth.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Email");

                    b.Property<bool>("IsAdministrator");

                    b.Property<bool>("IsInstructor");

                    b.Property<bool>("IsStudent");

                    b.Property<string>("Name");

                    b.Property<string>("Password");

                    b.Property<string>("UserName");

                    b.HasKey("Id");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("ApplicationUsers");
                });

            modelBuilder.Entity("GradeMe3.Courses.Course", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("GradeMe3.Emails.Mailbox", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("EmailAddress");

                    b.Property<string>("Password");

                    b.Property<int>("SmtpPort");

                    b.Property<string>("SmtpUrl");

                    b.Property<string>("UserName");

                    b.HasKey("Id");

                    b.ToTable("Mailboxes");
                });

            modelBuilder.Entity("GradeMe3.Evaluations.Evaluation", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("EvaluatedStudentId")
                        .IsRequired();

                    b.Property<string>("EvaluatorStudentId")
                        .IsRequired();

                    b.Property<int>("Grade");

                    b.Property<string>("Justification");

                    b.Property<string>("ProjectId")
                        .IsRequired();

                    b.Property<DateTime>("Time");

                    b.HasKey("Id");

                    b.HasIndex("EvaluatedStudentId");

                    b.HasIndex("EvaluatorStudentId");

                    b.HasIndex("ProjectId");

                    b.ToTable("Evaluations");
                });

            modelBuilder.Entity("GradeMe3.Instructors.Instructor", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationUserId")
                        .IsRequired();

                    b.Property<string>("CourseId");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.HasIndex("ApplicationUserId", "CourseId")
                        .IsUnique();

                    b.ToTable("Instructors");
                });

            modelBuilder.Entity("GradeMe3.Projects.Project", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CourseId");

                    b.Property<string>("Description");

                    b.Property<string>("EmailTemplate");

                    b.Property<string>("Name");

                    b.Property<string>("Status");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.HasIndex("Name", "CourseId")
                        .IsUnique();

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("GradeMe3.Students.Student", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationUserId")
                        .IsRequired();

                    b.Property<string>("CourseId");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.HasIndex("ApplicationUserId", "CourseId")
                        .IsUnique();

                    b.ToTable("Students");
                });

            modelBuilder.Entity("GradeMe3.Students.StudentInProject", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ProjectId");

                    b.Property<string>("StudentId");

                    b.Property<string>("TeamId");

                    b.HasKey("Id");

                    b.HasIndex("StudentId");

                    b.HasIndex("TeamId");

                    b.HasIndex("ProjectId", "StudentId")
                        .IsUnique();

                    b.ToTable("StudentsInProject");
                });

            modelBuilder.Entity("GradeMe3.Teams.Team", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.Property<string>("ProjectId");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId", "Name")
                        .IsUnique();

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("GradeMe3.Evaluations.Evaluation", b =>
                {
                    b.HasOne("GradeMe3.Students.Student", "EvaluatedStudent")
                        .WithMany("EvaluationsByOthers")
                        .HasForeignKey("EvaluatedStudentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("GradeMe3.Students.Student", "EvaluatorStudent")
                        .WithMany("Evaluations")
                        .HasForeignKey("EvaluatorStudentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("GradeMe3.Projects.Project", "Project")
                        .WithMany("Evaluations")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("GradeMe3.Instructors.Instructor", b =>
                {
                    b.HasOne("GradeMe3.Auth.ApplicationUser", "ApplicationUser")
                        .WithMany("Instructors")
                        .HasForeignKey("ApplicationUserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("GradeMe3.Courses.Course", "Course")
                        .WithMany("Instructors")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("GradeMe3.Projects.Project", b =>
                {
                    b.HasOne("GradeMe3.Courses.Course", "Course")
                        .WithMany("Projects")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("GradeMe3.Students.Student", b =>
                {
                    b.HasOne("GradeMe3.Auth.ApplicationUser", "ApplicationUser")
                        .WithMany("Students")
                        .HasForeignKey("ApplicationUserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("GradeMe3.Courses.Course", "Course")
                        .WithMany("Students")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("GradeMe3.Students.StudentInProject", b =>
                {
                    b.HasOne("GradeMe3.Projects.Project", "Project")
                        .WithMany("StudentsInProject")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("GradeMe3.Students.Student", "Student")
                        .WithMany("ProjectParticipation")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("GradeMe3.Teams.Team", "Team")
                        .WithMany("Members")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("GradeMe3.Teams.Team", b =>
                {
                    b.HasOne("GradeMe3.Projects.Project", "Project")
                        .WithMany("Teams")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
