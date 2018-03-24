import * as uuid from 'uuid';
import {action, observable} from 'mobx';
import {ProjectsStore} from '../stores/ProjectsStore';
import {ProjectModel} from './ProjectModel';

export type DialogMode = 'add' | 'edit';

export class ProjectDialogModel {
    @observable
    public id: string;
    @observable
    public courseId: string;
    @observable
    public isOpen: boolean;
    @observable
    public name: string;
    @observable
    public description: string;
    private mode: DialogMode;
    private projectsStore: ProjectsStore;

    constructor(projectsStore: ProjectsStore) {
        this.isOpen = false;
        this.projectsStore = projectsStore;
    }

    @action
    public openToEdit = (project: ProjectModel) => {
        this.id = project.id;
        this.courseId = project.courseId;
        this.name = project.name;
        this.description = project.description;
        this.isOpen = true;
        this.mode = 'edit';
    }

    @action
    public openToAdd = (courseId: string) => {
        console.log(`ProjectDialogModel opens to add project to course: ${courseId}.`);
        this.courseId = courseId;
        this.isOpen = true;
        this.mode = 'add';
    }

    @action
    public save = () => {
        if (this.mode === 'add') {
            const id = uuid.v4();
            const project = new ProjectModel(id, this.name, this.description, this.courseId);
            this.projectsStore.add([project]);
        } else if (this.mode === 'edit') {
            const project = new ProjectModel(this.id, this.name, this.description, this.courseId);
            this.projectsStore.save([project]);
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