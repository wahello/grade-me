import {observable} from 'mobx';
import {IInstructorDTO} from '../../shared/IInstructorDTO';

export class InstructorModel {
    public static createFromDTO(instructorDTO: IInstructorDTO) {
        const {id, userId, courseId, name, login, password, email} = instructorDTO;
        return new InstructorModel(id, userId, courseId, name, login, password, email);
    }

    public readonly id: string;
    public readonly userId: string;
    public readonly courseId: string;

    @observable
    public name: string;
    @observable
    public login: string;
    @observable
    public email: string;
    @observable
    public password: string;

    constructor(id: string,
                userId: string,
                courseId: string,
                name: string,
                login: string,
                password: string,
                email: string) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.name = name;
        this.login = login;
        this.password = password;
        this.email = email;
    }
}

export default InstructorModel;