import {InstructorsStore} from '../stores/InstructorsStore';
import {DialogMode} from './ProjectDialogModel';
import {action, observable} from 'mobx';
import {InstructorModel} from './InstructorModel';
import * as uuid from 'uuid';

export class InstructorDialogModel {
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
    private instructorsStore: InstructorsStore;

    constructor(instructorsStore: InstructorsStore) {
        this.isOpen = false;
        this.instructorsStore = instructorsStore;
    }

    @action
    public openToEdit = (instructor: InstructorModel) => {
        this.id = instructor.id;
        this.courseId = instructor.courseId;
        this.userId = instructor.userId;
        this.name = instructor.name;
        this.login = instructor.login;
        this.email = instructor.email;
        this.password = instructor.password;
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
            const instructor = new InstructorModel(id, userId, courseId, name, login, password, email);
            this.instructorsStore.add([instructor]);
        } else {
            const {id, userId, courseId, name, login, email, password} = this;
            const instructor = new InstructorModel(id, userId, courseId, name, login, password, email);
            this.instructorsStore.save([instructor]);
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