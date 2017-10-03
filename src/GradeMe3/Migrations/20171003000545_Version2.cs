using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace GradeMe3.Migrations
{
    public partial class Version2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EvaluationApprovals",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Approval = table.Column<double>(type: "REAL", nullable: false),
                    EvaluationId = table.Column<string>(type: "TEXT", nullable: true),
                    InstructorId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluationApprovals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluationApprovals_Instructors_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "Instructors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationApprovals_InstructorId",
                table: "EvaluationApprovals",
                column: "InstructorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EvaluationApprovals");
        }
    }
}
