import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { AgendarDto } from './dto/agendar-cita.dto';
import { SendEmailService } from 'src/send-email/send-email.service';
import { Code } from './entities/Code.entity';
import { CitaDisp } from './dto/citaDisp.dto'
import { Horario } from './entities/horario.entity';
import { DataCita } from './entities/dataCitas.entity';
import { AgendaDto } from './dto/DataAgenda.dto';
@Injectable()
export class CitasService {

  constructor(
    @InjectRepository(Cita) private citasRepository: Repository<Cita>,
    @InjectRepository(Code) private codeRepository: Repository<Code>,
    @InjectRepository(Horario) private horarioRepository: Repository<Horario>,
    @InjectRepository(DataCita) private DataCitaRepository: Repository<DataCita>,
    private readonly sendEmailService: SendEmailService,
  ) { }


  async getHorariosByCitas():Promise<Cita[]> {
    const hoy = new Date();
    await this.checkCitasByDate(hoy)
      return this.citasRepository.createQueryBuilder('citas')
      .innerJoinAndSelect('citas.horarios', 'horas')
      .where('horas.status = :status AND citas.status = :status', { status: 'activo' })
      .getMany()
  }
  async getDataCitas() {
    const horarios = await this.horarioRepository.createQueryBuilder('horario')
      .innerJoinAndSelect('horario.cita', 'cita')
      .innerJoinAndSelect('horario.dataCita', 'dataCita')
      .where('horario.status IN (:...statuses)', { statuses: ['pendiente', 'atendido'] })
      .select(['horario.id', 'horario.hora', 'horario.status', 'dataCita', 'cita.fecha'])
      .getMany();

    const result = horarios.map(horario => ({
      id: horario.id,
      hora: horario.hora,
      fecha: horario.cita.fecha,
      status: horario.status,
      dataCita: {
        id: horario.dataCita.id,
        name: horario.dataCita.name,
        lastname: horario.dataCita.lastname,
        motherlastname: horario.dataCita.motherlastname,
        email: horario.dataCita.email,
        cellphone: horario.dataCita.cellphone,
        asunto: horario.dataCita.asunto,
        status: horario.dataCita.status
      },
    }));
    return { horarios: result };
  }
  async createCitasDisponibles(dataCitasDisp: CitaDisp) {
    const foundDay = await this.citasRepository.findOne({
      where: {
        fecha: dataCitasDisp.fecha
      }
    });
    if (foundDay) {
      const foundHour = await this.horarioRepository.findOne({
        where: {
          hora: dataCitasDisp.horarios,
          cita: foundDay
        }
      });
      if (foundHour) {
        return {
          message: "Hora ya registrada",
          status: HttpStatus.CONFLICT
        }
      }
      const newHorario = this.horarioRepository.create({
        hora: dataCitasDisp.horarios,
        cita: foundDay
      });
      this.horarioRepository.save(newHorario);
    }
    else {
      const dayCita = this.citasRepository.create({
        fecha: dataCitasDisp.fecha
      });
      const saveCita = await this.citasRepository.save(dayCita);
      const foundCita = await this.citasRepository.findOne({
        where: {
          id: saveCita.id
        }
      });
      const newHorario = this.horarioRepository.create({
        hora: dataCitasDisp.horarios,
        cita: foundCita
      });
      this.horarioRepository.save(newHorario);
    }
    return {
      message: "Exito",
      status: HttpStatus.OK
    }
  }

  //Esta funcion se encarga de llamar a la funcion de "send-email" que genera y envia el codigo al correo, esta retorna el codigo y esta funcion de encarga de guardar el codigo en la base de datos
  async sendCodeConfirmation(data: AgendaDto) {
    const foundHorario = await this.horarioRepository.findOne({
      where: {
        id: data.idHorario
      }
    });
    if (!foundHorario) {
      return {
        message: "Horario no encontrado",
        status: HttpStatus.NOT_FOUND
      }
    }
    const code = await this.sendEmailService.sendCodeConfirmation(data.email);
    const newCode = this.codeRepository.create({
      code: code.toString(),
      idHorario: data.idHorario
    });
    const saveCode = await this.codeRepository.save(newCode);
    const data_: AgendarDto = {
      name: data.name,
      lastname: data.lastname,
      motherlastname: data.motherlastname,
      email: data.email,
      cellphone: data.cellphone,
      asunto: data.asunto,
    };
    const newAgenda = this.DataCitaRepository.create({
      code: saveCode,
      ...data_
    });
    this.DataCitaRepository.save(newAgenda);

    setTimeout(() => {
      this.deleteCodeAndCita(newAgenda.id);
      console.log("eliminado")
    }, 180000)
    return {
      message: "Exito",
      status: HttpStatus.OK
    }
  }
  async deleteCodeAndCita(idDataCita: number) {
    const foundDataCita = await this.DataCitaRepository.findOne({
      where: {
        id: idDataCita
      },
      relations: ['code']
    });
    if(!foundDataCita) return
    if (foundDataCita && foundDataCita.status === "Pconfirm") {
      this.horarioRepository.update(foundDataCita.code.idHorario, {
        dataCita: null
      });
      this.DataCitaRepository.delete(foundDataCita.id);
      this.codeRepository.delete(foundDataCita.code.id);
    }

  }
  //Esta funcion se encarga de revisar que el codigo enviado desde el front sea correcto y este en la base de datos
  async confirmCode(code: string) {
    const foundCode = await this.codeRepository.findOne({
      where: {
        code: code
      }
    });
    if (!foundCode) return {
      message: 'Codigo invalido',
      status: HttpStatus.NOT_FOUND
    }
    const foundHorario = await this.horarioRepository.findOne({
      where: {
        id: foundCode.idHorario
      }
    });
    if (foundHorario.status !== "activo") {
      return {
        message: "Horario no disponible",
        status: HttpStatus.NOT_FOUND
      }
    }
    const foundDataCita = await this.DataCitaRepository.findOne({
      where: {
        code: foundCode
      }
    });

    this.horarioRepository.update(foundCode.idHorario, {
      dataCita: foundDataCita,
      status: "pendiente"
    });
    this.DataCitaRepository.update(foundDataCita.id, {
      status: "agendado"
    });

    return {
      message: 'Exito',
      status: HttpStatus.OK
    }
  }

  async deleteHorario(id: number) {
    const foundHorario = await this.horarioRepository.findOne({
      where: {
        id
      }
    });
    if (!foundHorario) return {
      message: "No encontrado",
      status: HttpStatus.NOT_FOUND
    }
    this.horarioRepository.delete(id)
    return {
      message: "Exito",
      status: HttpStatus.OK
    }
  }

  async checkCitasByDate(date: Date) {

    const foundCitas = await this.citasRepository.find()
    for (let i = 0; i < foundCitas.length; i++) {
      const newP:Date = new Date(foundCitas[i].fecha)
      if (newP< date) {
        await this.citasRepository.update(foundCitas[i].id,{
          status:'inactivo'
        });
      }
    }
  }

} 