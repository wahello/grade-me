import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {Project} from './Project';
import {Instructor} from './Instructor';
import {Student} from './Student';

@Entity()
export class Course {
    @PrimaryColumn()
    public id: string;
    @Column()
    public name: string;
    @Column()
    public description: string;
    @OneToMany(type => Project, project => project.course)
    public projects: Project[];
    @OneToMany(type => Instructor, instructor => instructor.course)
    public instructors: Instructor[];
    @OneToMany(type => Student, student => student.course)
    public students: Student[];
}