import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto'
import { AgendarDto } from './dto/agendar-cita.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) { }

  @Post('')
  async create(@Body() createCitaDto: CreateCitaDto) {
    //console.log(createCitaDto)
    return this.citasService.createCita(createCitaDto);
  }
  @Get()
  async getCitas() {
    return this.citasService.getCitas();
  }

  @Post('/send-code')
  sendCodeConfirmation(@Body() data: AgendarDto) {
    console.log(data)
    return this.citasService.sendCodeConfirmation(data)
  }

  @Post('/confirm-code')
  confirmCodeCita(@Body()code:{code:string}) {
    return this.citasService.confirmCode(code.code)
  }

}
