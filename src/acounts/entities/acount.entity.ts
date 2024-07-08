import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('administradores')
export class Acount {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({ type: 'varchar', unique: true,nullable: false})
    email: string;
    @Column({ type: 'varchar', nullable: false })
    password: string;
    @Column({ type: 'varchar', nullable: false })
    nombre: string;
    @Column({ type: 'varchar', nullable: false })
    apellido: string;
    @Column({ type: 'varchar', nullable: false })
    apellidoM: string;
    @Column({ type: 'varchar', nullable: false })
    telefono: string;
    @Column({ type: 'varchar', nullable: false })
    genero: string;
    @Column({ type: 'varchar' })
    foto?: string;
    @Column({ type: 'varchar', nullable: false,default:'admin' })
    rol: string;
}
