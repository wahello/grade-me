import {IProjectDTO} from './IProjectDTO';

export interface IProjectsReplyDTO {
    projects: IProjectDTO[];
    isOk: boolean;
    error: string;
}