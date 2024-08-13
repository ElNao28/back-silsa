import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcountDto } from './dto/create-acount.dto';
import { UpdateAcountDto } from './dto/update-acount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Acount } from './entities/acount.entity';
import { Repository } from 'typeorm';
import { Login } from './interfaces/login.interface';
import * as cloudinary from 'cloudinary';
import toStream = require('buffer-to-stream')
cloudinary.v2.config({
  cloud_name: 'dh18jn2uy',
  api_key: '893466856516651',
  api_secret: 'z6KFbSWrcYC-ArtaVKlji51nW58'
});

@Injectable()
export class AcountsService {
  constructor(
    @InjectRepository(Acount) private acountRepository: Repository<Acount>
  ) { }
  async createAdmin(dataAdmin: CreateAcountDto, imagen: Express.Multer.File) {
    const newPromise = new Promise<{secure_url}>((resolve, reject)=>{
      const uploadImg = cloudinary.v2.uploader.upload_stream((err, result) => {
        if (err) return reject(err);
          resolve(result);
      });
      toStream(imagen.buffer).pipe(uploadImg);
    });
    const newAdmin = await this.acountRepository.create({
      foto:(await newPromise).secure_url,
      ...dataAdmin
    });
    this.acountRepository.save(newAdmin);
    return {
      message: 'exito',
      status: HttpStatus.OK
    }
  }
  async loginAdmin(data: Login) {
    const foundAdmin = await this.acountRepository.findOne({
      where: {
        email: data.email
      }
    });
    if (!foundAdmin) return {
      message: 'No encontrado',
      status: HttpStatus.NOT_FOUND
    }
    if (foundAdmin.password !== data.password) return {
      message: 'Contraseña incorrecta',
      status: HttpStatus.UNAUTHORIZED
    }
    if (foundAdmin.status !== 'activo') return {
      message: 'Contraseña incorrecta',
      status: HttpStatus.UNAUTHORIZED
    }

    return {
      message: 'Login exitoso',
      status: HttpStatus.OK,
      data: foundAdmin.id
    }
  }
  async checkRol(id: number) {
    const foundAcount = await this.acountRepository.findOne({
      where: {
        id: id
      }
    });

    const data: string = `${foundAcount.nombre} ${foundAcount.apellido} ${foundAcount.apellidoM}`
    return {
      message: 'Rol encontrado',
      status: HttpStatus.OK,
      data: {
        name: data,
        rol: foundAcount.rol,
        img:foundAcount.foto
      }
    }
  }
  async getFDataProfile(id: number) {
    const foundData = await this.acountRepository.findOne({
      where: {
        id
      }
    });
    if (!foundData) return {
      message: "No data found",
      status: HttpStatus.NOT_FOUND
    }

    const data = {
      nombre: foundData.nombre,
      apellido: foundData.apellido,
      apellidoM: foundData.apellidoM,
      telefono: foundData.telefono,
      email: foundData.email,
      genero: foundData.genero,
      foto: foundData.foto
    }
    return {
      message: "exito",
      status: HttpStatus.OK,
      data: data
    }
  }
  async getAdmins() {
    const foundAdmins = await this.acountRepository.find({
      where: {
        rol: 'admin'
      }
    });

    return {
      message: "found admins",
      status: HttpStatus.OK,
      data: foundAdmins
    }
  }
  async deleteAdmin(id: number) {
    
    const foundAdmin = await this.acountRepository.findOne({
      where: {
        id
      }
    });
    if (!foundAdmin) return {
      message: "admin not found",
      status: HttpStatus.NOT_FOUND
    }
    const idImg = foundAdmin.foto.split('/')[7].split('.')[0]
    cloudinary.v2.api.delete_resources([idImg],{type:'upload',resource_type:'image'}).then();
    this.acountRepository.delete(foundAdmin.id);
    return {
      message: "admin deleted",
      status: HttpStatus.OK
    }
  }
  async desactivateAdmin(id: number) {
    const foundAdmin = await this.acountRepository.findOne({
      where: {
        id
      }
    });
    if (!foundAdmin) return {
      message: "admin not found",
      status: HttpStatus.NOT_FOUND
    }
    this.acountRepository.update(foundAdmin.id, {
      status: 'inactivo'
    });
    return {
      message: "admin desactivate",
      status: HttpStatus.OK
    }
  }
  async activateAdmin(id: number) {
    const foundAdmin = await this.acountRepository.findOne({
      where: {
        id
      }
    });
    if (!foundAdmin) return {
      message: "admin not found",
      status: HttpStatus.NOT_FOUND
    }
    this.acountRepository.update(foundAdmin.id, {
      status: 'activo'
    });
    return {
      message: "admin activado",
      status: HttpStatus.OK
    }
  }
}
