import {observable} from 'mobx';
import {ICourseDTO} from '../../shared/ICourseDTO';

export class CourseModel {
    public static createFromDTO(courseDTO: ICourseDTO) {
        const {id, name, description} = courseDTO;
        return new CourseModel(id, name, description);
    }

    public readonly id: string;
    @observable
    public name: string;
    @observable
    public description: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export default CourseModel;