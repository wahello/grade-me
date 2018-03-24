import {StudentModel} from '../models/StudentModel';
import {action, observable, ObservableMap, runInAction} from 'mobx';
import {RootStore} from './RootStore';
import {IStudentsRequestDTO} from '../../shared/IStudentsRequestDTO';
import {IStudentsReplyDTO} from '../../shared/IStudentsReplyDTO';
import {addStudentsAPI, deleteProjectsAPI, deleteStudentsAPI, fetchStudentsAPI, updateStudentsAPI} from '../api/api';
import {IStudentDTO} from '../../shared/IStudentDTO';
import {IStudentsUpdateRequestDTO} from '../../shared/IStudentsUpdateRequestDTO';
import {IReplyDTO} from '../../shared/IReplyDTO';
import ProjectModel from '../models/ProjectModel';
import {IProjectsAddReplyDTO} from '../../shared/IProjectsAddReplyDTO';
import {IProjectsAddRequestDTO} from '../../shared/IProjectsAddRequestDTO';
import {IStudentsAddRequestDTO} from '../../shared/IStudentsAddRequestDTO';
import {IDeleteRequestDTO} from '../../shared/IDeleteRequestDTO';

export class StudentsStore {
    public studentsById: ObservableMap<StudentModel> = observable.map(new Map());

    @observable
    public isBusy: boolean = false;

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    public fetch = async () => {
        const courseId = this.rootStore.courseScreen.courseId;
        console.log(`StudentsStore fetching students for course ${courseId}.`);
        const request: IStudentsRequestDTO = {
            courseId
        };
        try {
            this.isBusy = true;
            const reply: IStudentsReplyDTO = await fetchStudentsAPI(request);
            console.log(`StudentsStore received a reply: ${JSON.stringify(reply)}.`);
            if (reply.isOk) {
                runInAction(() => {
                    this.studentsById.replace(this.studentsFromDTO(reply.students));
                });
            }
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    @action
    public save = async (students: StudentModel[]) => {
        const request: IStudentsUpdateRequestDTO = {
            students: this.studentsToDTO(students)
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await updateStudentsAPI(request);
            runInAction(() => {
                if (reply.isOk) {
                    console.log(`Students updated`);
                    students.forEach(student => {
                        this.studentsById.set(student.id, student);
                    });
                }
            });
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    @action
    public add = async (students: StudentModel[]) => {
        console.log(`StudentStore.add(${JSON.stringify(students)}).`);
        const request: IStudentsAddRequestDTO = {
            students: this.studentsToDTO(students)
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await addStudentsAPI(request);
            console.log(`StudentStore received a reply: ${JSON.stringify(reply)}.`);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Students added');
                    students.forEach(student => {
                        this.studentsById.set(student.id, student);
                    });
                }
            });
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    @action
    public delete = async (ids: string[]) => {
        console.log(`StudentsStore delete invoked. ids: ${JSON.stringify(ids)}.`);
        const request: IDeleteRequestDTO = {ids};
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await deleteStudentsAPI(request);
            console.log(`StudentsStore received a reply: ${JSON.stringify(reply)}`);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Students deleted');
                    ids.forEach(id => this.studentsById.delete(id));
                }
            });
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    private studentsFromDTO(studentDTOs: IStudentDTO[]) {
        const students = studentDTOs
            .map(StudentModel.createFromDTO)
            .map(student => [student.id, student] as [string, StudentModel]);
        return new Map(students);
    }

    private studentsToDTO(students: StudentModel[]) {
        const studentDTOs: IStudentDTO[] = students.map(x => ({
            id: x.id,
            userId: x.userId,
            courseId: x.courseId,
            name: x.name,
            login: x.login,
            email: x.email,
            password: x.password
        }));
        return studentDTOs;
    }
}