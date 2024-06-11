import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    @Column({type:"varchar",nullable:false,default:"activo"})
    status:string;
    
    @OneToMany(()=>Horario,horario => horario.cita)
    horarios:Horario[]
}
