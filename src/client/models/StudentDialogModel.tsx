import {StudentsStore} from '../stores/StudentsStore';
import {DialogMode} from './ProjectDialogModel';
import {action, observable} from 'mobx';
import {StudentModel} from './StudentModel';
import * as uuid from 'uuid';

export class StudentDialogModel {
    @observable
    public id: string;
    @observable
    public userId: string;
    @observable
    public courseId: string;
    @observable
    public isOpen: boolean;
    @observable
    public name: string;
    @observable
    public login: string;
    @observable
    public email: string;
    @observable
    public password: string;

    private mode: DialogMode;
    private studentsStore: StudentsStore;

    constructor(studentsStore: StudentsStore) {
        this.isOpen = false;
        this.studentsStore = studentsStore;
    }

    @action
    public openToEdit = (student: StudentModel) => {
        this.id = student.id;
        this.courseId = student.courseId;
        this.userId = student.userId;
        this.name = student.name;
        this.login = student.login;
        this.email = student.email;
        this.password = student.password;
        this.mode = 'add';
    }

    @action
    public openToAdd = (courseId: string) => {
        this.courseId = courseId;
        this.isOpen = true;
        this.mode = 'add';
    }

    @action
    public save = () => {
        if (this.mode === 'add') {
            const id = uuid.v4();
            const userId = uuid.v4();
            const {courseId, name, login, password, email} = this;
            const student = new StudentModel(id, userId, courseId, name, login, password, email);
            this.studentsStore.add([student]);
        } else {
            const {id, userId, courseId, name, login, email, password} = this;
            const student = new StudentModel(id, userId, courseId, name, login, password, email);
            this.studentsStore.save([student]);
        }
        this.isOpen = false;
        this.mode = undefined;
    }

    @action
    public cancel = () => {
        this.isOpen = false;
    }

    @action
    public setName = (name: string) => {
        this.name = name;
    }

    @action
    public setLogin = (login: string) => {
        this.login = login;
    }

    @action
    public setEmail = (email: string) => {
        this.email = email;
    }

    @action
    public setPassword = (password: string) => {
        this.password = password;
    }
}