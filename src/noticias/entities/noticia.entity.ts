import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('noticias')
export class Noticia {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:'varchar',nullable:false})
    titulo:string;
    @Column({type:'varchar',nullable:false,length:5000})
    contenido:string;
    @Column({type:'varchar',nullable:false})
    autor:string;
    @Column({type:'varchar',nullable:false})
    fecha:string;
    @Column({type:'varchar',nullable:false})
    img:string;
    @Column({type:'varchar',nullable:false,default:"activo"})
    status:string;
}
