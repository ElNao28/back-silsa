import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcountDto } from './dto/create-acount.dto';
import { UpdateAcountDto } from './dto/update-acount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Acount } from './entities/acount.entity';
import { Repository } from 'typeorm';
import { Login } from './interfaces/login.interface';

@Injectable()
export class AcountsService {
  constructor(@InjectRepository(Acount)private acountRepository:Repository<Acount>){}
  async loginAdmin(data:Login){
    const foundAdmin = await this.acountRepository.findOne({
      where:{
        email:data.email
      }
    });
    if(!foundAdmin) return {
      message:'No encontrado',
      status:HttpStatus.NOT_FOUND
    }
    if(foundAdmin.password !== data.password) return{
      message:'Contraseña incorrecta',
      status:HttpStatus.UNAUTHORIZED
    }
    return{
      message:'Login exitoso',
      status:HttpStatus.OK,
      data:foundAdmin.id
    }
  }
  async checkRol(id:number){
    const foundAcount = await this.acountRepository.findOne({
      where:{
        id:id
      }
    });

    const data:string = `${foundAcount.nombre} ${foundAcount.apellido} ${foundAcount.apellidoM}`
    return {
      message:'Rol encontrado',
      status:HttpStatus.OK,
      data:{
        name:data,
        rol:foundAcount.rol
      }
    }
  }
}
