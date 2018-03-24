import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Team {
    @PrimaryColumn()
    public id: string;
    @Column()
    public name: string;
    @Column()
    public description: string;
    @Column()
    public projectId: string;
}