import {IStudentDTO} from './IStudentDTO';

export interface IStudentsReplyDTO {
    error: string;
    isOk: boolean;
    students: IStudentDTO[];
}