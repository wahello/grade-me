import * as uuid from 'uuid';
import {action, observable} from 'mobx';
import {CoursesStore} from '../stores/CoursesStore';
import {CourseModel} from './CourseModel';

type DialogMode = 'add' | 'edit';

export class CourseDialogModel {
    @observable
    public id: string;
    @observable
    public isOpen: boolean;
    @observable
    public name: string;
    @observable
    public description: string;
    private mode: DialogMode;
    private coursesStore: CoursesStore;

    constructor(coursesStore: CoursesStore) {
        this.isOpen = false;
        this.coursesStore = coursesStore;
    }

    @action
    public openToEdit = (course: CourseModel) => {
        this.id = course.id;
        this.name = course.name;
        this.description = course.description;
        this.isOpen = true;
        this.mode = 'edit';
    }

    @action
    public openToAdd = () => {
        this.isOpen = true;
        this.mode = 'add';
    }

    @action
    public save = () => {
        if (this.mode === 'add') {
            const id = uuid.v4();
            const course = new CourseModel(id, this.name, this.description);
            this.coursesStore.add([course]);
        } else if (this.mode === 'edit') {
            const course = new CourseModel(this.id, this.name, this.description);
            this.coursesStore.save([course]);
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
    public setDescription = (description: string) => {
        this.description = description;
    }
}