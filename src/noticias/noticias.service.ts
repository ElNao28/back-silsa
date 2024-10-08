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
import { DataNoticia } from './entities/data-noticias.entity';

cloudinary.v2.config({
  cloud_name: 'dh18jn2uy',
  api_key: '893466856516651',
  api_secret: 'z6KFbSWrcYC-ArtaVKlji51nW58'
});

@Injectable()
export class NoticiasService {

  constructor(
    @InjectRepository(Noticia) private noticiaRepository: Repository<Noticia>,
    @InjectRepository(Acount) private acountRepository: Repository<Acount>,
    @InjectRepository(DataNoticia) private dataNoticiaRepository: Repository<DataNoticia>
  ) { }

  async createNewNotice(dataNotice: { position: number, type: string, content: string }[], files: Array<Express.Multer.File>, fecha: string, idAutor: string) {
    const foundAdmin = await this.acountRepository.findOneBy({ id: +idAutor })
    const newNotice = this.noticiaRepository.create({
      status: 'activo',
      autor: `${foundAdmin.nombre} ${foundAdmin.apellido} ${foundAdmin.apellidoM}`,
      fecha: fecha
    });
    const saveNewNotice = await this.noticiaRepository.save(newNotice)
    for (let i = 0; i < dataNotice.length; i++) {
      const { position, type, content } = dataNotice[i];
      const newData = this.dataNoticiaRepository.create({
        type,
        position,
        content,
        noticia: saveNewNotice
      });
      this.dataNoticiaRepository.save(newData)
    }
    for (let i = 0; i < files.length; i++) {
      const newPromise = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadImg = cloudinary.v2.uploader.upload_stream({ folder: 'noticias' }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
        toStream(files[i].buffer).pipe(uploadImg);
      });
      const foundNotice = await this.dataNoticiaRepository.findOne({
        where: {
          content: files[i].originalname,
          type: 'image',
          noticia: saveNewNotice
        }
      });
      if (foundNotice) {
        this.dataNoticiaRepository.update(foundNotice.id, {
          content: newPromise.secure_url
        })
      }
    }
    return {
      message: 'Exito',
      status: HttpStatus.OK
    }
  }
  async getNoticiasForAdmin() {
    const noticias = await this.noticiaRepository.find(
      {
        order: {
          id: 'DESC'
        },
        relations: ['dataNoticias']
      }
    );
    return {
      message: 'Noticias encontradas',
      status: HttpStatus.OK,
      data: noticias
    }
  }
  // async getNoticiasForUser() {
  //   const noticias = await this.noticiaRepository.find({
  //     where: {
  //       status: 'activo'
  //     },
  //     order: {
  //       id: 'DESC'
  //     },
  //   });
  //   return {
  //     message: 'Noticias encontradas',
  //     status: HttpStatus.OK,
  //     data: noticias
  //   }
  // }
  async getNoticiaById(id: number) {
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: id
      },
      relations: ['dataNoticias'],
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    foundNoticia.dataNoticias.sort((a, b) => a.position - b.position)
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
      },
      relations: ['dataNoticias']
    });
    console.log(foundNoticia)
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    if (foundNoticia.dataNoticias) {
      const images = foundNoticia.dataNoticias.filter(data => data.type === 'image')
      for (let i = 0; i < images.length; i++) {
        const idImg = images[i].content.split('/')[8].split('.')[0]
        console.log(idImg)
        cloudinary.v2.api.delete_resources([`noticias/${idImg}`], { type: 'upload', resource_type: 'image' }).then();
      }
    }
    await this.dataNoticiaRepository.delete({ noticia: foundNoticia })
    this.noticiaRepository.delete(foundNoticia.id)
    return {
      message: 'Noticia eliminada',
      status: HttpStatus.OK
    }
  }
  async updateNoticia(idNoticia: number, dataNoticia: { id: number, content: string, position: number, type: string, }[], files: Array<Express.Multer.File>) {
    const foundNoticia = await this.noticiaRepository.findOne({
      where: {
        id: idNoticia
      },
      relations: ['dataNoticias']
    });
    if (!foundNoticia) {
      return {
        message: 'Noticia no encontrada',
        status: HttpStatus.NOT_FOUND
      }
    }
    for (let i = 0; i < foundNoticia.dataNoticias.length; i++) {
      const isFound = dataNoticia.find(data => data.id === foundNoticia.dataNoticias[i].id)
      if (!isFound) {
        this.dataNoticiaRepository.delete(foundNoticia.dataNoticias[i].id)
      }
    }
    for (let i = 0; i < dataNoticia.length; i++) {
      if (dataNoticia[i].id) {
        const foundDataNotice = await this.dataNoticiaRepository.findOneBy({ id: dataNoticia[i].id })
        if (foundDataNotice) {
          if (foundDataNotice.type === 'image') {
            const foundDataImage = files.find(data => data.originalname === dataNoticia[i].content);
            if (foundDataImage) {
              const idImage = foundDataNotice.content.split('/')[8].split('.')[0];
              cloudinary.v2.api.delete_resources([`noticias/${idImage}`], { type: 'upload', resource_type: 'image' }).then();
              const newPromise = await new Promise<{ secure_url: string }>((resolve, reject) => {
                const uploadImage = cloudinary.v2.uploader.upload_stream({ folder: 'noticias' }, (err, res) => {
                  if (err) return reject(err)
                  resolve(res)
                });
                toStream(foundDataImage.buffer).pipe(uploadImage)
              });
              await this.dataNoticiaRepository.update(foundDataNotice.id, {
                content: newPromise.secure_url
              });
            }
          }
          else {
            await this.dataNoticiaRepository.update(foundDataNotice.id, {
              content: dataNoticia[i].content
            })
          }
        }
      }
      else {
        const newComponent = this.dataNoticiaRepository.create({
          type: dataNoticia[i].type,
          position: dataNoticia[i].position,
          content: dataNoticia[i].content,
          noticia: foundNoticia
        });
        await this.dataNoticiaRepository.save(newComponent);
        for (let j = 0; j < files.length; j++) {
          const newPromise = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadImage = cloudinary.v2.uploader.upload_stream({ folder: 'noticias' }, (err, result) => {
              if (err) return reject(err)
              resolve(result)
            });
            toStream(files[j].buffer).pipe(uploadImage)
          });
          const foundDataNotice = await this.dataNoticiaRepository.findOne({
            where: {
              content: files[j].originalname,
              type: 'image',
              noticia: foundNoticia
            }
          });
          if (foundDataNotice) {
            this.dataNoticiaRepository.update(foundDataNotice.id, {
              content: newPromise.secure_url
            });
          }

        }
      }
    }
    return {
      message: 'Noticia actualizada',
      status: HttpStatus.OK
    }
  }
  async getTreeNoticie() {
    const noticias = await this.noticiaRepository.find({
      where: {
        status: 'activo'
      },
      order: {
        id: 'DESC'
      },
      relations: ['dataNoticias'],
      take: 3
    });

    return {
      message: 'Noticias encontradas',
      status: HttpStatus.OK,
      data: noticias
    };
  }
  async getNoticiasForUser() {
    const noticias = await this.noticiaRepository.find({
      where: {
        status: 'activo'
      },
      order: {
        id: 'DESC'
      },
      relations: ['dataNoticias']
    });
    return {
      message: 'Noticias encontradas',
      status: HttpStatus.OK,
      data: noticias
    };

  }

}
