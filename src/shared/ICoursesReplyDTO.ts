import {ICourseDTO} from './ICourseDTO';

export interface ICoursesReplyDTO {
    error: string;
    isOk: boolean;
    courses: ICourseDTO[];
}