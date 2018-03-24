import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {Evaluation} from './Evaluation';
import {Course} from './Course';

@Entity()
export class Project {
    @PrimaryColumn()
    public id: string;
    @OneToMany(type => Course, course => course.projects)
    public course: Course;
    @Column()
    public name: string;
    @Column()
    public description: number;
    @Column()
    public status: string;
    @Column()
    public emailTemplate: string;
    @OneToMany(type => Evaluation, evaluation => evaluation.project)
    public evaluations: Evaluation[];
}