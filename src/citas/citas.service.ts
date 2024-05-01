import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { Horario } from './entities/horario.entity';
import { AgendarDto } from './dto/agendar-cita.dto';
import { SendEmailService } from 'src/send-email/send-email.service';
import { Code } from './entities/Code.entity';

@Injectable()
export class CitasService {

  constructor(
    @InjectRepository(Cita) private citasRepository: Repository<Cita>,
    @InjectRepository(Horario) private horariosRepository: Repository<Horario>,
    @InjectRepository(Code) private codeRepository:Repository<Code>,
    private readonly sendEmailService:SendEmailService,
  ) { }
  async createCita(createCitaDto: CreateCitaDto) {
    const dataCitas = await this.citasRepository.findOne({
      where: {
        dia: createCitaDto.dia
      }
    });
    if (dataCitas) {
      const newHorario = this.horariosRepository.create({
        hora: createCitaDto.hora,
        cita: dataCitas
      });
      this.horariosRepository.save(newHorario);
      return {
        message: 'Cita creada exitosamente',
        status: HttpStatus.OK
      }
    }
    const newCita = this.citasRepository.create({
      dia: createCitaDto.dia,
      mes: createCitaDto.mes,
      anio: createCitaDto.anio,
    });
    const saveCita = await this.citasRepository.save(newCita);

    const newHorario = this.horariosRepository.create({
      hora: createCitaDto.hora,
      cita: saveCita
    });
    this.horariosRepository.save(newHorario)
    return {
      message: 'Cita creada exitosamente',
      status: HttpStatus.OK
    }
  }
  getCitas() {
    return this.citasRepository.find({
      relations:['horarios']
    });
  }

  async sendCodeConfirmation(data:AgendarDto){
    const code = await this.sendEmailService.sendCodeConfirmation(data.email);
    const newCode = this.codeRepository.create({code:code.toString()});
    this.codeRepository.save(newCode);
    return {
      message:"Exito",
      status:HttpStatus.OK
    }
  }

  async confirmCode(code:string){
    const foundCode = await this.codeRepository.findOne({
      where:{
        code:code
      }
    });

    if(!foundCode) return{
      message:'Codigo invalido',
      status:HttpStatus.NOT_FOUND
    }

    return {
      message:'Exito',
      status:HttpStatus.OK
    }
  }
}
