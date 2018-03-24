import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import {Student} from './Student';
import {Project} from './Project';
import {EvaluationApproval} from './EvalutationApproval';

@Entity()
export class Evaluation {
    @PrimaryColumn()
    public id: string;
    @ManyToOne(type => Student, student => student.evaluationsBy)
    public evaluatorStudent: Student;
    @ManyToOne(type => Student, student => student.evaluationsTo)
    public evaluatedStudent: Student;
    @Column('double')
    public grade: number;
    @Column()
    public justification: string;
    @ManyToOne(type => Project, project => project.evaluations)
    public project: Project;
    @Column('datetime')
    public time: Date;
    @OneToMany(type => EvaluationApproval, approval => approval.evaluation)
    public approvals: EvaluationApproval[];
}