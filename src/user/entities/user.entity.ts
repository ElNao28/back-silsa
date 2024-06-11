import { Entity,PrimaryGeneratedColumn,Column } from 'typeorm'
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id:number
    @Column({type:'varchar',nullable:false})
    name:string
    @Column({type:'varchar',nullable:false})
    lastname:string
    @Column({type:'varchar',nullable:false})
    motherlastname:string
    @Column({type:'varchar',nullable:false})
    gender:string
    @Column({type:'varchar',nullable:false})
    email:string
    @Column({type:'varchar',nullable:false})
    cellphone:number
}
