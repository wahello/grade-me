import * as bodyParser from 'body-parser';
import * as mysql from 'mysql';
import * as _ from 'lodash';
import {RequestHandler, Router} from 'express';
import {IUserDTO} from '../../shared/IUserDTO';
import {ISignInReplyDTO} from '../../shared/ISignInReplyDTO';
import {ICoursesReplyDTO} from '../../shared/ICoursesReplyDTO';
import {ICourseAddRequestDTO} from '../../shared/ICourseAddRequestDTO';
import {IReplyDTO} from '../../shared/IReplyDTO';
import {ICoursesUpdateRequestDTO} from '../../shared/ICoursesUpdateRequestDTO';
import {ICourseDTO} from '../../shared/ICourseDTO';
import {Connection, MysqlError} from 'mysql';
import {IDeleteRequestDTO} from '../../shared/IDeleteRequestDTO';
import {IProjectsAddRequestDTO} from '../../shared/IProjectsAddRequestDTO';
import {IProjectsRequestDTO} from '../../shared/IProjectsRequestDTO';
import {IProjectsReplyDTO} from '../../shared/IProjectsReplyDTO';
import {IProjectsUpdateRequestDTO} from '../../shared/IProjectsUpdateRequestDTO';
import {IStudentsRequestDTO} from '../../shared/IStudentsRequestDTO';
import {IStudentsReplyDTO} from '../../shared/IStudentsReplyDTO';
import {IStudentsUpdateRequestDTO} from '../../shared/IStudentsUpdateRequestDTO';
import {IInstructorsAddRequestDTO} from '../../shared/IInstructorsAddRequestDTO';
import {IInstructorsRequestDTO} from '../../shared/IInstructorsRequestDTO';
import {IInstructorsReplyDTO} from '../../shared/IInstructorsReplyDTO';
import {IStudentsAddRequestDTO} from '../../shared/IStudentsAddRequestDTO';

export class ReplyBuilder {
    public static goodReply: () => IReplyDTO = () => {
        return {
            isOk: true,
            error: null
        };
    }

    public static badReply: (err: any) => IReplyDTO = err => {
        return {
            isOk: false,
            error: err
        };
    }
}

export function apiRouter(dbConnection) {
    function createDeleteByIdsHandler(entity: string): RequestHandler {
        return (req, res) => {
            console.log(`Delete ${entity} request received: ${JSON.stringify(req.body)}.`);
            const body = req.body as IDeleteRequestDTO;
            const sql = `DELETE FROM ${entity} WHERE Id IN (?)`;
            dbConnection.query(sql, [body.ids], (err, result) => {
                if (err) {
                    console.log(`Failed to delete ${entity}. Error: ${err}`);
                    const badReply: IReplyDTO = {
                        isOk: false,
                        error: err.message
                    };
                    res.send(badReply);
                    return;
                }
                console.log(`Number of records (${entity}) deleted: ${result.affectedRows}.`);
                const goodReply: IReplyDTO = {
                    isOk: true,
                    error: null
                };
                res.send(goodReply);
                return;
            });
        };
    }

    const router = Router();
    router.use(bodyParser.json());

    router.post('/api/sign-in', (req, res) => {
        const reply: ISignInReplyDTO = {
            error: '',
            isOk: true,
            user: {
                imageUrl: '',
                userId: 'testUserId',
                userName: 'testUserName'
            }
        };
        res.send(reply);
    });

    router.post('/api/courses-fetch', (req, res) => {
        console.log('/api/courses-fetch requst received');
        dbConnection.query('SELECT * from courses', (err, result, fields) => {
            if (err) {
                const badReply: ICoursesReplyDTO = {
                    error: err,
                    isOk: false,
                    courses: null
                };
                res.send(badReply);
                return;
            }
            console.log('Selected courses from DB.');
            const goodReply: ICoursesReplyDTO = {
                error: '',
                isOk: true,
                courses: result.map(course => ({
                    id: course.Id,
                    name: course.Name,
                    description: course.Description
                }))
            };
            res.send(goodReply);
        });
    });

    router.post('/api/courses-update', (req, res) => {
        console.log('/api/courses-update request received');
        const body = req.body as ICoursesUpdateRequestDTO;
        const sql = body.courses.map(course => {
            return mysql.format(
                `UPDATE courses SET Name = ?, Description = ? WHERE Id = ?`,
                [course.name, course.description, course.id]
            );
        }).join(';');
        dbConnection.query(sql, (err, results, fields) => {
            if (err) {
                console.log('Failed to update courses. Error: ' + err);
                res.send(ReplyBuilder.badReply(err));
            }
            console.log('Courses updated');
            res.send(ReplyBuilder.goodReply());
            return;
        });
    });

    router.post('/api/courses-add', (req, res) => {
        console.log('/api/courses-add request received');
        const sql = `INSERT INTO courses (Id, Name, Description) VALUES ?`;
        const values = (req.body as ICourseAddRequestDTO).courses.map(course => [
            course.id,
            course.name,
            course.description
        ]);
        dbConnection.query(sql, [values], (err, result) => {
            if (err) {
                console.log('Failed to add courses. Error: ' + err);
                res.send(ReplyBuilder.badReply(err));
                return;
            }
            console.log('Number of courses inserted: ' + result.affectedRows);
            res.send(ReplyBuilder.goodReply());
            return;
        });
    });

    router.post('/api/courses-delete', createDeleteByIdsHandler('courses'));

    router.post('/api/projects-fetch', (req, res) => {
        console.log('/api/projects-fetch request received');
        const sql = `SELECT * FROM projects WHERE CourseId = ?`;
        const request: IProjectsRequestDTO = req.body;
        const values = [request.courseId];
        dbConnection.query(sql, values, (err, result, fields) => {
            if (err) {
                const badReply: IProjectsReplyDTO = {
                    projects: null,
                    error: err,
                    isOk: false
                };
                res.send(badReply);
                return;
            }
            console.log(`Selected projects from DB`);
            const goodReply: IProjectsReplyDTO = {
                isOk: true,
                error: null,
                projects: result.map(project => ({
                    id: project.Id,
                    name: project.Name,
                    description: project.Description,
                    courseId: project.CourseId
                }))
            };
            res.send(goodReply);
        });
    });

    router.post('/api/projects-update', (req, res) => {
        console.log('/api/projects-update request received');
        const body = req.body as IProjectsUpdateRequestDTO;
        const sql = body.projects.map(project => {
            return mysql.format(
                `UPDATE projects SET Name = ?, Description = ? WHERE Id = ?`,
                [project.name, project.description, project.id]
            );
        }).join(';');
        dbConnection.query(sql, (err, results, fields) => {
            if (err) {
                console.log('Failed to update projects. Error: ' + err);
                res.send(ReplyBuilder.badReply(err));
            }
            console.log('Projects updated');
            res.send(ReplyBuilder.goodReply());
            return;
        });
    });

    router.post('/api/projects-add', (req, res) => {
        console.log(`/api/projects-add request received: ${JSON.stringify(req.body)}.`);
        const sql = `INSERT INTO projects (Id, Name, Description, CourseId) VALUES ?`;
        const values = (req.body as IProjectsAddRequestDTO).projects.map(project => [
            project.id,
            project.name,
            project.description,
            project.courseId
        ]);
        const query = mysql.format(sql, [values]);
        console.log(`Running query: ${query}.`);
        dbConnection.query(query, (err, result) => {
            if (err) {
                console.log(`Failed to add projects. Error: ${err}`);
                res.send(ReplyBuilder.badReply(err));
                return;
            }
            console.log(`Number of projects inserted: ${result.affectedRows}`);
            res.send(ReplyBuilder.goodReply());
        });
    });

    router.post('/api/projects-delete', createDeleteByIdsHandler('projects'));

    router.post('/api/projects-update', (req, res) => {
        console.log(`/api/projects-update request received: ${JSON.stringify(req.body)}.`);
        const body = req.body as IProjectsUpdateRequestDTO;
        const sql = body.projects.map(({name, description, id}) => {
            return mysql.format(
                `UPDATE projects SET Name = ?, Description = ? WHERE Id = ?`,
                [name, description, id]
            );
        }).join(';');
        console.log(`Running query: ${sql}.`);
        dbConnection.query(sql, (err, results, fields) => {
            if (err) {
                console.log('Failed to update projects. Error: ' + err);
                res.send(ReplyBuilder.badReply(err));
            }
            console.log('Projects updated');
            res.send(ReplyBuilder.goodReply());
            return;
        });
    });

    // Students

    router.post('/api/students-fetch', (req, res) => {
        console.log(`/api/students-fetch request received`);
        const sql = `SELECT Id, CourseId, UserId FROM students INNER JOIN users ON ` +
            `students.UserId = users.Id WHERE students.CourseId = ?`;
        const request: IStudentsRequestDTO = req.body;
        const values = [request.courseId];
        dbConnection.query(sql, values, (err, result, fields) => {
            if (err) {
                console.log(`Failed to fetch students for request ${JSON.stringify(request)}`);
                const badReply: IStudentsReplyDTO = {
                    students: null,
                    error: err,
                    isOk: false
                };
                res.send(badReply);
                return;
            }
            console.log(`Selected students from DB`);
            const goodReply: IStudentsReplyDTO = {
                isOk: true,
                error: null,
                students: result.map(student => ({
                    id: student.Id,
                    courseId: student.CouseId,
                    userId: student.UserId,
                    name: student.Name,
                    login: student.Login,
                    email: student.Email,
                    password: student.Password
                }))
            };
            res.send(goodReply);
        });
    });

    router.post(`/api/students-add`, (req, res) => {
        console.log(`/api/students-add request received: ${JSON.stringify(req.body)}.`);
        const insertUsersSql = `INSERT INTO users (Id, Name, Login, Email, Password) VALUES ?`;
        const insertStudentsSql = `INSERT INTO students (Id, CourseId, UserId) VALUES ?`;
        const body = req.body as IStudentsAddRequestDTO;
        const users = body.students.map(x => [
            x.userId,
            x.name,
            x.login,
            x.email,
            x.password
        ]);
        const students = body.students.map(x => [
            x.id,
            x.courseId,
            x.userId
        ]);
        const insertUsersQuery = mysql.format(insertUsersSql, [users]);
        const insertStudentsQuery = mysql.format(insertStudentsSql, [students]);
        const rollback = (error: MysqlError) => {
            dbConnection.rollback(() => {
                res.send(ReplyBuilder.badReply(error));
            });
        };
        dbConnection.beginTransaction(errBegin => {
            if (errBegin) {
                console.log(`Failed to start transaction.`, errBegin);
                res.send(ReplyBuilder.badReply(errBegin));
                return;
            }
            dbConnection.query(insertUsersQuery, (errUsers, resultUsers) => {
                if (errUsers) {
                    console.log(`Failed to add users for students`, errUsers);
                    rollback(errUsers);
                    return;
                }
                console.log(`Users added`);
                dbConnection.query(insertStudentsQuery, (studentsErr, studentsResult) => {
                    if (studentsErr) {
                        console.log(`Failed to add students`, studentsErr);
                        rollback(studentsErr);
                        return;
                    }
                    dbConnection.commit(errCommit => {
                        if (errCommit) {
                            console.log(`Failed to commit transaction`, errCommit);
                            rollback(errCommit);
                            return;
                        }
                        res.send(ReplyBuilder.goodReply());
                        return;
                    });
                });
            });
        });
    });

    router.post(`/api/students-delete`, (req, res) => {
        console.log(`/api/students-delete request received: ${JSON.stringify(req.body)}`);
        const body = req.body as IDeleteRequestDTO;
        const rollback = (e: MysqlError) => {
            dbConnection.rollback(() => {
                res.send(ReplyBuilder.badReply(e));
            });
        };
        dbConnection.beginTransaction(errBegin => {
            if (errBegin) {
                console.log(`Failed to start transaction.`, errBegin);
                res.send(ReplyBuilder.badReply(errBegin));
                return;
            }
            const idsSql = `SELECT students.UserId FROM students WHERE students.Id IN (?)`;
            const idsQuery = mysql.format(idsSql, [body.ids]);
            dbConnection.query(idsQuery, (errIds, resultIds) => {
                if (errIds) {
                    console.log(`Failed to get user ids for the given students`, errIds);
                    rollback(errIds);
                    return;
                }
                const userIds = resultIds.map(x => x.UserId);
                const deleteSql = `DELETE FROM users WHERE Id IN (?)`;
                const deleteQuery = mysql.format(deleteSql, [userIds]);
                dbConnection.query(deleteQuery, (errDelete, resultDelete) => {
                    if (errDelete) {
                        console.log(`Failed to delete users`, errDelete);
                        rollback(errDelete);
                        return;
                    }
                    dbConnection.commit(errCommit => {
                        if (errCommit) {
                            console.log(`Failed to commit transaction`, errCommit);
                            rollback(errCommit);
                            return;
                        }
                        res.send(ReplyBuilder.goodReply());
                        return;
                    });
                });
            });
        });
    });

    // Student update/add/delete should modify User table too. Not sure how exactly.

    router.post(`/api/instructors-fetch`, (req, res) => {
        console.log(`/api/instructors-fetch request received: ${JSON.stringify(req.body)}`);
        const body = req.body as IInstructorsRequestDTO;
        const sql = `SELECT instructors.Id AS InstructorId, instructors.CourseId, instructors.UserId, ` +
            `users.Name, users.Login, users.Email, users.Password ` +
            `FROM instructors INNER JOIN users ON instructors.UserId = users.Id ` +
            `WHERE instructors.CourseId = ?`;
        const query = mysql.format(sql, [body.courseId]);
        dbConnection.query(query, (err, result) => {
            if (err) {
                console.log(`Failed to select instructors.`, err);
                res.send(ReplyBuilder.badReply(err));
                return;
            }
            console.log(`Selected instructors from DB`);
            const reply: IInstructorsReplyDTO = {
                isOk: true,
                error: null,
                instructors: result.map(x => ({
                    id: x.InstructorId,
                    userId: x.UserId,
                    courseId: x.CourseId,
                    name: x.Name,
                    login: x.Login,
                    email: x.Email,
                    password: x.Password
                }))
            };
            res.send(reply);
        });
    });

    router.post(`/api/instructors-add`, (req, res) => {
        console.log(`/api/instructors-add request received: ${JSON.stringify(req.body)}.`);
        const insertUsersSql = `INSERT INTO users (Id, Name, Login, Email, Password) VALUES ?`;
        const insertInstructorsSql = `INSERT INTO instructors (Id, CourseId, UserId) VALUES ?`;
        const body = req.body as IInstructorsAddRequestDTO;
        const users = body.instructors.map(x => [
            x.userId,
            x.name,
            x.login,
            x.email,
            x.password
        ]);
        const instructors = body.instructors.map(x => [
            x.id,
            x.courseId,
            x.userId
        ]);
        const insertUsersQuery = mysql.format(insertUsersSql, [users]);
        const insertInstructorsQuery = mysql.format(insertInstructorsSql, [instructors]);
        const rollback = (error: MysqlError) => {
            dbConnection.rollback(() => {
                res.send(ReplyBuilder.badReply(error));
            });
        };
        dbConnection.beginTransaction(errBegin => {
            if (errBegin) {
                console.log(`Failed to start transaction.`, errBegin);
                res.send(ReplyBuilder.badReply(errBegin));
                return;
            }
            dbConnection.query(insertUsersQuery, (errUsers, resultUsers) => {
                if (errUsers) {
                    console.log(`Failed to add users for instructors`, errUsers);
                    rollback(errUsers);
                    return;
                }
                console.log(`Users added`);
                dbConnection.query(insertInstructorsQuery, (instructorsErr, instructorsResult) => {
                    if (instructorsErr) {
                        console.log(`Failed to add instructors`, instructorsErr);
                        rollback(instructorsErr);
                        return;
                    }
                    dbConnection.commit(errCommit => {
                        if (errCommit) {
                            console.log(`Failed to commit transaction`, errCommit);
                            rollback(errCommit);
                            return;
                        }
                        res.send(ReplyBuilder.goodReply());
                        return;
                    });
                });
            });
        });
    });

    router.post(`/api/instructors-delete`, (req, res) => {
        console.log(`/api/instructors-delete request received: ${JSON.stringify(req.body)}`);
        const body = req.body as IDeleteRequestDTO;
        const rollback = (e: MysqlError) => {
            dbConnection.rollback(() => {
                res.send(ReplyBuilder.badReply(e));
            });
        };
        dbConnection.beginTransaction(errBegin => {
            if (errBegin) {
                console.log(`Failed to start transaction.`, errBegin);
                res.send(ReplyBuilder.badReply(errBegin));
                return;
            }
            const idsSql = `SELECT instructors.UserId FROM instructors WHERE instructors.Id IN (?)`;
            const idsQuery = mysql.format(idsSql, [body.ids]);
            dbConnection.query(idsQuery, (errIds, resultIds) => {
                if (errIds) {
                    console.log(`Failed to get user ids for the given instructors`, errIds);
                    rollback(errIds);
                    return;
                }
                const userIds = resultIds.map(x => x.UserId);
                const deleteSql = `DELETE FROM users WHERE Id IN (?)`;
                const deleteQuery = mysql.format(deleteSql, [userIds]);
                dbConnection.query(deleteQuery, (errDelete, resultDelete) => {
                    if (errDelete) {
                        console.log(`Failed to delete users`, errDelete);
                        rollback(errDelete);
                        return;
                    }
                    dbConnection.commit(errCommit => {
                        if (errCommit) {
                            console.log(`Failed to commit transaction`, errCommit);
                            rollback(errCommit);
                            return;
                        }
                        res.send(ReplyBuilder.goodReply());
                        return;
                    });
                });
            });
        });
    });

    return router;
}