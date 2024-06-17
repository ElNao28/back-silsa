import { Module } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noticia } from './entities/noticia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Noticia])],
  controllers: [NoticiasController],
  providers: [NoticiasService],
})
export class NoticiasModule {}
