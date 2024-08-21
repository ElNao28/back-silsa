import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DataNoticia } from "./data-noticias.entity";

@Entity('noticias')
export class Noticia {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:'varchar',nullable:false})
    autor:string;
    @Column({type:'date'})
    fecha:Date;
    @Column({type:'varchar',nullable:false,default:"activo"})
    status:string;

    @OneToMany(()=>DataNoticia, dataNoticia => dataNoticia.noticia)
    dataNoticias:DataNoticia[]
}
