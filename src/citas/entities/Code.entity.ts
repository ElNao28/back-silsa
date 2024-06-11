import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('code')
export class Code{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({nullable:false})
    code:string;
    @Column({nullable:false})
    idHorario:number;
}