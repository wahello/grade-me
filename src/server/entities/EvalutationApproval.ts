import {Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import {Evaluation} from './Evaluation';
import {Instructor} from './Instructor';

@Entity()
export class EvaluationApproval {
    @PrimaryColumn()
    public id: string;
    @Column('double')
    public approval: number;
    @ManyToOne(type => Evaluation, evaluation => evaluation.approvals)
    public evaluation: Evaluation;
    @ManyToOne(type => Instructor, instructor => instructor.approvals)
    public instructor: Instructor;
}