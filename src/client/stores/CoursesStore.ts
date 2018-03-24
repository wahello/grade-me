import {action, IMap, observable, ObservableMap, runInAction} from 'mobx';
import {Dictionary} from 'lodash';
import {CourseModel} from '../models/CourseModel';
import {RootStore} from './RootStore';
import {ICoursesRequestDTO} from '../../shared/ICoursesRequestDTO';
import {ICoursesReplyDTO} from '../../shared/ICoursesReplyDTO';
import {addCoursesAPI, deleteCoursesAPI, fetchCoursesAPI, updateCoursesAPI} from '../api/api';
import {ICourseDTO} from '../../shared/ICourseDTO';
import * as _ from 'lodash';
import {ICourseAddRequestDTO} from '../../shared/ICourseAddRequestDTO';
import {IReplyDTO} from '../../shared/IReplyDTO';
import {ICoursesUpdateRequestDTO} from '../../shared/ICoursesUpdateRequestDTO';
import {IDeleteRequestDTO} from '../../shared/IDeleteRequestDTO';

export class CoursesStore {
    public coursesById: ObservableMap<CourseModel> = observable.map(new Map());

    @observable
    public isBusy: boolean = false;

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    public fetch = async () => {
        const userId = this.rootStore.auth.signedInUser.id;
        const request: ICoursesRequestDTO = {
            userId
        };
        try {
            this.isBusy = true;
            const reply: ICoursesReplyDTO = await fetchCoursesAPI(request);
            if (reply.courses) {
                runInAction(() => {
                    this.coursesById.replace(this.coursesFromDTO(reply.courses));
                });
            }
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    @action
    public save = async (courses: CourseModel[]) => {
        const request: ICoursesUpdateRequestDTO = {
            courses: this.coursesToDTO(courses)
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await updateCoursesAPI(request);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Courses updated');
                    courses.forEach(course => {
                        this.coursesById.set(course.id, course);
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
    public add = async (courses: CourseModel[]) => {
        const request: ICourseAddRequestDTO = {
            courses: this.coursesToDTO(courses)
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await addCoursesAPI(request);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Course added');
                    courses.forEach(course => {
                        this.coursesById.set(course.id, course);
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
        const request: IDeleteRequestDTO = {
            ids
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await deleteCoursesAPI(request);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Courses deleted');
                    ids.forEach(id => this.coursesById.delete(id));
                }
            });
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    private coursesFromDTO(coursesDTO: ICourseDTO[]): Map<string, CourseModel> {
        const courses = coursesDTO
            .map(CourseModel.createFromDTO)
            .map(course => [course.id, course] as [string, CourseModel]);
        return new Map(courses);
    }

    private coursesToDTO(courses: CourseModel[]) {
        const courseDTOs: ICourseDTO[] = courses.map(course => ({
            id: course.id,
            name: course.name,
            description: course.description
        }));
        return courseDTOs;
    }
}