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
      console.log("La Primera")
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
    console.log("La Segunda")
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
  //Esta funcion se encarga de retornar las citas
  getCitas() {
    return this.citasRepository.find({
      relations:['horarios']
    });
  }
//Esta funcion se encarga de llamar a la funcion de "send-email" que genera y envia el codigo al correo, esta retorna el codigo y esta funcion de encarga de guardar el codigo en la base de datos
  async sendCodeConfirmation(data:AgendarDto){
    const code = await this.sendEmailService.sendCodeConfirmation(data.email);
    const newCode = this.codeRepository.create({code:code.toString()});
    this.codeRepository.save(newCode);
    return {
      message:"Exito",
      status:HttpStatus.OK
    }
  }
//Esta funcion se encarga de revisar que el codigo enviado desde el front sea correcto y este en la base de datos
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
