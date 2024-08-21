import { Module } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noticia } from './entities/noticia.entity';
import { Acount } from 'src/acounts/entities/acount.entity';
import { DataNoticia } from './entities/data-noticias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Noticia,Acount,DataNoticia])],
  controllers: [NoticiasController],
  providers: [NoticiasService],
})
export class NoticiasModule {}
