import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import {EvaluationApproval} from './EvalutationApproval';
import {Course} from './Course';
import {User} from './User';

@Entity()
export class Instructor {
    @PrimaryColumn()
    public id: string;
    @ManyToOne(type => Course, course => course.instructors)
    public course: Course;
    @ManyToOne(type => User, user => user.instructor)
    public user: User;
    @OneToMany(type => EvaluationApproval, approval => approval.instructor)
    public approvals: EvaluationApproval[];
}