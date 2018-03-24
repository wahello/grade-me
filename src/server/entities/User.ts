import {Entity, Column, PrimaryColumn, OneToMany} from 'typeorm';
import {Student} from './Student';
import {Instructor} from './Instructor';

@Entity()
export class User {
    @PrimaryColumn()
    public id: string;
    @Column()
    public name: string;
    @Column()
    public login: string;
    @Column()
    public email: string;
    @Column()
    public password: string;
    @OneToMany(type => Student, student => student.user)
    public students: Student[];
    @OneToMany(type => Instructor, instructor => instructor.user)
    public instructors: Instructor[];
}