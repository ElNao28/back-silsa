import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Horario } from "./horario.entity";

@Entity('citas')
export class Cita {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"int",nullable:false})
    dia:number;
    @Column({type:"int",nullable:false})
    mes:number;
    @Column({type:"int",nullable:false})
    anio:number;

    @OneToMany(()=>Horario,horario =>horario.cita)
    horarios:Horario[];
}
