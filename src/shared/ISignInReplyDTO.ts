import {IUserDTO} from './IUserDTO';

export interface ISignInReplyDTO {
    isOk: boolean;
    user: IUserDTO;
    error: string;
}