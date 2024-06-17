import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Noticia } from './entities/noticia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoticiasService {
  
  constructor(@InjectRepository(Noticia)private noticiaRepository:Repository<Noticia>){}
  async getNoticiasForAdmin() {
    const noticias = await this.noticiaRepository.find();
    return {
      message:'Noticias encontradas',
      status:HttpStatus.OK,
      data:noticias
    }
  }
  async getNoticiasForUser(){
    const noticias = await this.noticiaRepository.find({
      where:{
        status:'activo'
      }
    });
    return {
      message:'Noticias encontradas',
      status:HttpStatus.OK,
      data:noticias
    }
  }
  async getNoticiaById(id: number){
    const foundNoticia = await this.noticiaRepository.findOne({
      where:{
        id:id
      }
    });
    if(!foundNoticia){
      return{
        message:'Noticia no encontrada',
        status:HttpStatus.NOT_FOUND
      }
    }
    return{
      message:'Noticia encontrada',
      status:HttpStatus.OK,
      data:foundNoticia
    }
  }
  createNoticia(createNoticiaDto: CreateNoticiaDto) {
    const newNoticia = this.noticiaRepository.create({
      status:'activo',
      ...createNoticiaDto
    });
    this.noticiaRepository.save(newNoticia);
    return{
      message:'Noticia creada',
      status:HttpStatus.OK
    }
  }
  async desactivateNoticia(idNoticia:number){
    const foundNoticia = await  this.noticiaRepository.findOne({
      where:{
        id:idNoticia
      }
    });
    if(!foundNoticia){
      return{
        message:'Noticia no encontrada',
        status:HttpStatus.NOT_FOUND
      }
    }
    foundNoticia.status='inactivo';
    this.noticiaRepository.save(foundNoticia);
    return{
      message:'Noticia desactivada',
      status:HttpStatus.OK
    }
  }
  async activateNoticia(idNoticia:number){
    const foundNoticia = await this.noticiaRepository.findOne({
      where:{
        id:idNoticia
      }
    });
    if(!foundNoticia){
      return{
        message:'Noticia no encontrada',
        status:HttpStatus.NOT_FOUND
      }
    }
    foundNoticia.status='activo';
    this.noticiaRepository.save(foundNoticia);
    return{
      message:'Noticia activada',
      status:HttpStatus.OK
    }
  }
  async deleteNoticia(idNoticia:number){
    const foundNoticia = await this.noticiaRepository.findOne({
      where:{
        id:idNoticia
      }
    });
    if(!foundNoticia){
      return{
        message:'Noticia no encontrada',
        status:HttpStatus.NOT_FOUND
      }
    }
    this.noticiaRepository.delete(foundNoticia);
    return{
      message:'Noticia eliminada',
      status:HttpStatus.OK
    }
  }
  async updateNoticia(idNoticia:number,dataNoticia:UpdateNoticiaDto){
    const foundNoticia = await this.noticiaRepository.findOne({
      where:{
        id:idNoticia
      }
    });
    if(!foundNoticia){
      return{
        message:'Noticia no encontrada',
        status:HttpStatus.NOT_FOUND
      }
    }
    this.noticiaRepository.update(idNoticia,dataNoticia);
    return{
      message:'Noticia actualizada',
      status:HttpStatus.OK
    }
  }

}
