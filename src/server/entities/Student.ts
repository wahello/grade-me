import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import {Evaluation} from './Evaluation';
import {Course} from './Course';
import {User} from './User';

@Entity()
export class Student {
    @PrimaryColumn()
    public id: string;
    @ManyToOne(type => User, user => user.students)
    public user: User;
    @ManyToOne(type => Course, course => course.students)
    public course: Course;
    @OneToMany(type => Evaluation, evaluation => evaluation.evaluatorStudent)
    public evaluationsBy: Evaluation[];
    @OneToMany(type => Evaluation, evaluation => evaluation.evaluatedStudent)
    public evaluationsTo: Evaluation[];
}