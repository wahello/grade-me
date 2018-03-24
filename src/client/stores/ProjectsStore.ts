import {action, observable, ObservableMap, runInAction} from 'mobx';
import ProjectModel from '../models/ProjectModel';
import {RootStore} from './RootStore';
import {IProjectsRequestDTO} from '../../shared/IProjectsRequestDTO';
import {IProjectsReplyDTO} from '../../shared/IProjectsReplyDTO';
import {IProjectsAddRequestDTO} from '../../shared/IProjectsAddRequestDTO';
import {IProjectsAddReplyDTO} from '../../shared/IProjectsAddReplyDTO';
import {IProjectDTO} from '../../shared/IProjectDTO';

import {addProjectsAPI, deleteProjectsAPI, fetchProjectsAPI, updateProjectsAPI} from '../api/api';
import {IDeleteRequestDTO} from '../../shared/IDeleteRequestDTO';
import {IReplyDTO} from '../../shared/IReplyDTO';
import {IProjectsUpdateRequestDTO} from '../../shared/IProjectsUpdateRequestDTO';

export class ProjectsStore {
    public projectsById: ObservableMap<ProjectModel> = observable.map(new Map());

    @observable
    public isBusy: boolean = false;

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    public fetch = async () => {
        const courseId = this.rootStore.courseScreen.courseId;
        console.log(`ProjectsStore fetching projects for course ${courseId}.`);
        const request: IProjectsRequestDTO = {
            courseId
        };
        try {
            this.isBusy = true;
            const reply: IProjectsReplyDTO = await fetchProjectsAPI(request);
            console.log(`ProjectsStore received a reply: ${JSON.stringify(reply)}.`);
            if (reply.isOk) {
                runInAction(() => {
                    this.projectsById.replace(this.projectsFromDTO(reply.projects));
                });
            }
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    @action
    public save = async (projects: ProjectModel[]) => {
        const request: IProjectsUpdateRequestDTO = {
            projects: this.projectsToDTO(projects)
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await updateProjectsAPI(request);
            runInAction(() => {
                if (reply.isOk) {
                    console.log(`Projects updated`);
                    projects.forEach(project => {
                        this.projectsById.set(project.id, project);
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
    public add = async (projects: ProjectModel[]) => {
        console.log(`ProjectStore.add(${JSON.stringify(projects)}).`);
        const request: IProjectsAddRequestDTO = {
            projects: this.projectsToDTO(projects)
        };
        try {
            this.isBusy = true;
            const reply: IProjectsAddReplyDTO = await addProjectsAPI(request);
            console.log(`ProjectStore received a reply: ${JSON.stringify(reply)}.`);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Projects added');
                    projects.forEach(project => {
                        this.projectsById.set(project.id, project);
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
        console.log(`ProjectsStore delete invoked. ids: ${JSON.stringify(ids)}.`);
        const request: IDeleteRequestDTO = {ids};
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await deleteProjectsAPI(request);
            console.log(`ProjectsStore received a reply: ${JSON.stringify(reply)}`);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Projects deleted');
                    ids.forEach(id => this.projectsById.delete(id));
                }
            });
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    private projectsFromDTO(projectDTOs: IProjectDTO[]) {
        const projects = projectDTOs
            .map(ProjectModel.createFromDTO)
            .map(project => [project.id, project] as [string, ProjectModel]);
        return new Map(projects);
    }

    private projectsToDTO(projects: ProjectModel[]) {
        const projectDTOs: IProjectDTO[] = projects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            courseId: project.courseId
        }));
        return projectDTOs;
    }
}