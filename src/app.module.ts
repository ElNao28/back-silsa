import { Module } from '@nestjs/common';
import { SendEmailModule } from './send-email/send-email.module';
import { CitasModule } from './citas/citas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticiasModule } from './noticias/noticias.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database:'bd_silsa',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    SendEmailModule, 
    CitasModule, NoticiasModule], 
  controllers: [],
  providers: [],
})
export class AppModule {}
