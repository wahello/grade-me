import {IProjectDTO} from '../../shared/IProjectDTO';
import {observable} from 'mobx';

export class ProjectModel {
    public static createFromDTO(projectDTO: IProjectDTO) {
        const {id, name, description, courseId} = projectDTO;
        return new ProjectModel(id, name, description, courseId);
    }

    public readonly id: string;
    public readonly courseId: string;
    @observable
    public name: string;
    @observable
    public description: string;

    constructor(id: string, name: string, description: string, courseId: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.courseId = courseId;
    }
}

export default ProjectModel;