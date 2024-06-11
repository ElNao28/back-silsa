import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { SendEmailService } from 'src/send-email/send-email.service';
import { Code } from './entities/Code.entity';
import { DataCita } from './entities/dataCitas.entity';
import { Horario } from './entities/horario.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Cita,Code,DataCita,Horario])],
  controllers: [CitasController],
  providers: [CitasService,SendEmailService],
})
export class CitasModule {}
