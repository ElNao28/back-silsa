import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Horario } from './entities/horario.entity';
import { SendEmailService } from 'src/send-email/send-email.service';
import { Code } from './entities/Code.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cita,Horario,Code])],
  controllers: [CitasController],
  providers: [CitasService,SendEmailService],
})
export class CitasModule {}
