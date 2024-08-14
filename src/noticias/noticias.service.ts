import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Noticia } from './entities/noticia.entity';
import { Repository } from 'typeorm';
import * as cloudinary from 'cloudinary';
import toStream = require('buffer-to-stream')

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { Acount } from 'src/acounts/entities/acount.entity';

cloudinary.v2.config({
  cloud_name: 'dh18jn2uy',
  api_key: '893466856516651',
  api_secret: 'z6KFbSWrcYC-ArtaVKlji51nW58'
});

@Injectable()
export class NoticiasService {

  constructor(
    @InjectRepository(Noticia) private noticiaRepository: Repository<Noticia>,
    @InjectRepository(Acount) private acountRepository: Repository<Acount>
  ) { }

  async createNoticia(createNoticiaDto: CreateNoticiaDto, file: { imagen?: Express.Multer.File[] }) {
    let imagen:string = "";
    for (let i = 0; i < file.imagen.length; i++) {
      const filePath = path.join(os.tmpdir(), file.imagen[i].originalname);
      fs.writeFileSync(filePath, file.imagen[i].buffer);
      
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'noticias',
        resource_type: 'image'
      });
      imagen = result.secure_url;
      fs.unlinkSync(filePath);
    }
    const foundAdmin = await this.acountRepository.findOneBy({id:+createNoticiaDto.autor});
    const nameAdmin = `${foundAdmin.nombre} ${foundAdmin.apellido} ${foundAdmin.apellidoM}`;
    const {autor,img,...data} = createNoticiaDto;
    const newNoticia = this.noticiaRepository.create({
      status:'activo',
      img: imagen,
      autor:nameAdmin,
      ...data
    });
    this.noticiaRepository.save(newNoticia);
    return {
      message: 'Noticia creada',
      status: HttpStatus.OK
    }
  }
  async getNoticiasForAdmin() {
    const noticias = await this.noticiaRepository.find(
      {
        order: {
          id: 'DESC'
        },
      }
    );
    return {
      message: 'Noticias encontradas',
      status: HttpStatus.OK,
      data: noticias
    }
  }
  async getNoticiasForUser() {
    const noticias = await this.noticiaRepository.find({
      where: {
        status: 'activo'
      },
      order: {
        id: 'DESC'
      },
    });
    return {
      message: 'Noticias encontradas',
      status: HttpStatus.OK,
      data: noticias
    }
  }
  async getNoticiaById(id: number) {
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: id
      }
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    return {
      message: 'Noticia encontrada',
      status: HttpStatus.OK,
      data: foundNoticia
    }
  }
  async desactivateNoticia(idNoticia: number) {
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: idNoticia
      }
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    foundNoticia.status = 'inactivo';
    this.noticiaRepository.save(foundNoticia);
    return {
      message: 'Noticia desactivada',
      status: HttpStatus.OK
    }
  }
  async activateNoticia(idNoticia: number) {
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: idNoticia
      }
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    foundNoticia.status = 'activo';
    this.noticiaRepository.save(foundNoticia);
    return {
      message: 'Noticia activada',
      status: HttpStatus.OK
    }
  }
  async deleteNoticia(idNoticia: number) {
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: idNoticia
      }
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    const idImg = foundNoticia.img.split('/')[8].split('.')[0]
    cloudinary.v2.api.delete_resources([`noticias/${idImg}`],{type:'upload',resource_type:'image'}).then();
    this.noticiaRepository.delete(foundNoticia);
    return {
      message: 'Noticia eliminada',
      status: HttpStatus.OK
    }
  }
  async updateNoticia(idNoticia: number, dataNoticia: UpdateNoticiaDto) {
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: idNoticia
      }
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    this.noticiaRepository.update(idNoticia, dataNoticia);
    return {
      message: 'Noticia actualizada',
      status: HttpStatus.OK
    }
  }
  async getTreeNoticie() {
    const noticias = await this.noticiaRepository.find({
      order: {
        id: 'DESC'
      },
      take: 3
    });

    return {
      message: 'Noticias encontradas',
      status: HttpStatus.OK,
      data: noticias
    };
  }

  async editImgNoticia(id:number, imagen:Express.Multer.File){
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: id
      }
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    const idImg = foundNoticia.img.split('/')[8].split('.')[0];
    cloudinary.v2.api.delete_resources([`noticias/${idImg}`],{type:'upload',resource_type:'image'}).then();
    
    const newPromise = await new Promise<{secure_url:string}>((resolve, reject) => {
      const newImg = cloudinary.v2.uploader.upload_stream({folder:'noticias'},(err, result)=>{
        if(err) reject(err);
        resolve(result);
      });
      toStream(imagen.buffer).pipe(newImg)
    })
    this.noticiaRepository.update(id,{
      img: newPromise.secure_url
    });
    return {
      message: 'Imagen actualizada',
      status: HttpStatus.OK
    }
  }
}
