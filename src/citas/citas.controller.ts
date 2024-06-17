import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitaDisp } from './dto/citaDisp.dto';
import { AgendaDto } from './dto/DataAgenda.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) { }

  @Post('create-horario')
  createCitaDisp(@Body()dataCitaDisp:CitaDisp){
    return this.citasService.createCitasDisponibles(dataCitaDisp);
  }
  @Post('/send-code')
  sendCodeConfirmation(@Body() data: AgendaDto) {
    console.log(data)
    return this.citasService.sendCodeConfirmation(data);
  }

  @Post('/confirm-code')
  confirmCodeCita(@Body()code:{code:string}) {
    return this.citasService.confirmCode(code.code);
  }

  @Get()
  getHorariosByCitas(){
    return this.citasService.getHorariosByCitas()
  }
  @Get('data-citas')
  getDataCitas(){
    return this.citasService.getDataCitas()
  }
  @Delete('delete-horario/:id')
  deleteHorario(@Param('id')id:string){
    return this.citasService.deleteHorario(parseInt(id));
  }
}
