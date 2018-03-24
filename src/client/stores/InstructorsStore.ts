import {action, observable, ObservableMap, runInAction} from 'mobx';
import InstructorModel from '../models/InstructorModel';
import {RootStore} from './RootStore';
import {IInstructorsRequestDTO} from '../../shared/IInstructorsRequestDTO';
import {IInstructorsReplyDTO} from '../../shared/IInstructorsReplyDTO';
import {IInstructorsAddRequestDTO} from '../../shared/IInstructorsAddRequestDTO';
import {IInstructorDTO} from '../../shared/IInstructorDTO';
import {addInstructorsAPI, deleteInstructorsAPI, fetchInstructorsAPI, updateInstructorsAPI} from '../api/api';
import {IDeleteRequestDTO} from '../../shared/IDeleteRequestDTO';
import {IReplyDTO} from '../../shared/IReplyDTO';
import {IInstructorsUpdateRequestDTO} from '../../shared/IInstructorsUpdateRequestDTO';

export class InstructorsStore {
    public instructorsById: ObservableMap<InstructorModel> = observable.map(new Map());

    @observable
    public isBusy: boolean = false;

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    public fetch = async () => {
        const courseId = this.rootStore.courseScreen.courseId;
        console.log(`InstructorsStore fetching instructors for course ${courseId}.`);
        const request: IInstructorsRequestDTO = {
            courseId
        };
        try {
            this.isBusy = true;
            const reply: IInstructorsReplyDTO = await fetchInstructorsAPI(request);
            console.log(`InstructorsStore received a reply: ${JSON.stringify(reply)}.`);
            if (reply.isOk) {
                runInAction(() => {
                    this.instructorsById.replace(this.instructorsFromDTO(reply.instructors));
                });
            }
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    @action
    public save = async (instructors: InstructorModel[]) => {
        const request: IInstructorsUpdateRequestDTO = {
            instructors: this.instructorsToDTO(instructors)
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await updateInstructorsAPI(request);
            runInAction(() => {
                if (reply.isOk) {
                    console.log(`Instructors updated`);
                    instructors.forEach(instructor => {
                        this.instructorsById.set(instructor.id, instructor);
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
    public add = async (instructors: InstructorModel[]) => {
        console.log(`InstructorStore.add(${JSON.stringify(instructors)}).`);
        const request: IInstructorsAddRequestDTO = {
            instructors: this.instructorsToDTO(instructors)
        };
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await addInstructorsAPI(request);
            console.log(`InstructorStore received a reply: ${JSON.stringify(reply)}.`);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Instructors added');
                    instructors.forEach(instructor => {
                        this.instructorsById.set(instructor.id, instructor);
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
        console.log(`InstructorsStore delete invoked. ids: ${JSON.stringify(ids)}.`);
        const request: IDeleteRequestDTO = {ids};
        try {
            this.isBusy = true;
            const reply: IReplyDTO = await deleteInstructorsAPI(request);
            console.log(`InstructorsStore received a reply: ${JSON.stringify(reply)}`);
            runInAction(() => {
                if (reply.isOk) {
                    console.log('Instructors deleted');
                    ids.forEach(id => this.instructorsById.delete(id));
                }
            });
        } finally {
            runInAction(() => {
                this.isBusy = false;
            });
        }
    }

    private instructorsFromDTO(instructorDTOs: IInstructorDTO[]) {
        const instructors = instructorDTOs
            .map(InstructorModel.createFromDTO)
            .map(instructor => [instructor.id, instructor] as [string, InstructorModel]);
        return new Map(instructors);
    }

    private instructorsToDTO(instructors: InstructorModel[]): IInstructorDTO[] {
        const instructorDTOs: IInstructorDTO[] = instructors.map(instructor => ({
            id: instructor.id,
            userId: instructor.userId,
            courseId: instructor.courseId,
            name: instructor.name,
            login: instructor.login,
            email: instructor.email,
            password: instructor.password
        }));
        return instructorDTOs;
    }
}