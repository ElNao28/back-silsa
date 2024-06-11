import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Code } from "./Code.entity";

@Entity('data_citas')
export class DataCita{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:'varchar', nullable:false})
    name:string;
    @Column({type:'varchar', nullable:false})
    lastname:string;
    @Column({type:'varchar', nullable:false})
    motherlastname:string;
    @Column({type:'varchar', nullable:false})
    email:string;
    @Column({type:'varchar', nullable:false})
    cellphone:number;
    @Column({type:'varchar', nullable:false})
    asunto:string;
    @Column({type:'varchar', nullable:false,default:"Pconfirm"})
    status:string


    @OneToOne(()=>Code)
    @JoinColumn()
    code:Code;
    
}