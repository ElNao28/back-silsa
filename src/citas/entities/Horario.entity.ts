import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cita } from './cita.entity'
import { DataCita } from "./dataCitas.entity";
@Entity('horario')
export class Horario{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"varchar",nullable:false})
    hora:string;
    @Column({type:"varchar",nullable:false, default:"activo"})
    status:string;

    @ManyToOne(()=>Cita,cita => cita.horarios)
    cita:Cita
    
    @OneToOne(()=>DataCita)
    @JoinColumn()
    dataCita:DataCita
}