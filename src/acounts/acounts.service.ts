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
  async createAdmin(dataAdmin:CreateAcountDto){
    const newAdmin = await this.acountRepository.create({
      foto:'img.png',
      ...dataAdmin
    });
    this.acountRepository.save(newAdmin);
    return{
      message:'exito',
      status:HttpStatus.OK
    }
  }
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
  async getFDataProfile(id:number){
    const foundData = await this.acountRepository.findOne({
      where:{
        id
      }
    });
    if(!foundData) return{
      message: "No data found",
      status:HttpStatus.NOT_FOUND
    }

    const data = {
      nombre:foundData.nombre,
      apellido:foundData.apellido,
      apellidoM:foundData.apellidoM,
      telefono:foundData.telefono,
      email:foundData.email,
      genero:foundData.genero,
      foto:foundData.foto
    }
    return {
      message:"exito",
      status:HttpStatus.OK,
      data: data
    }
  }
}
