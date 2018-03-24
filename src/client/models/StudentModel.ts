import {IStudentDTO} from '../../shared/IStudentDTO';
import {observable} from 'mobx';

export class StudentModel {
    public static createFromDTO(studentDTO: IStudentDTO) {
        const {userId, courseId, id, email, login, name, password} = studentDTO;
        return new StudentModel(id, userId, courseId, name, login, password, email);
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
        this.courseId = courseId;
        this.userId = userId;
        this.name = name;
        this.login = login;
        this.email = email;
        this.password = password;
    }
}