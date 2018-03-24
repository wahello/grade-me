import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class StudentInProject {
    @PrimaryColumn()
    public id: string;
    @Column()
    public projectId: string;
    @Column()
    public studentId: string;
    @Column()
    public teamId: string;
}