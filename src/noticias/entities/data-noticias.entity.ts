import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Noticia } from "./noticia.entity";

@Entity('data_noticia')
export class DataNoticia{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    type:string;
    @Column({type:'text'})
    content:string;
    @Column()
    position:number;

    @ManyToOne(() => Noticia, noticia => noticia.dataNoticias)
    noticia: Noticia;
}