import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cita } from "./cita.entity";

@Entity('horario')
export class Horario{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type:'time'})
    hora: string;
    @Column({nullable:true,default:'libre'})
    status:string;
    
    @ManyToOne(()=>Cita,cita => cita.horarios)
    cita:Cita;
}