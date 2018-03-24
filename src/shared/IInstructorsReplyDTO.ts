import {IInstructorDTO} from './IInstructorDTO';

export interface IInstructorsReplyDTO {
    error: string;
    isOk: boolean;
    instructors: IInstructorDTO[];
}