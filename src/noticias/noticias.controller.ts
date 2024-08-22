import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) { }

  /**********************************************************************************************************/
  @Get()
  findAll() {
    return this.noticiasService.getNoticiasForAdmin();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticiasService.getNoticiaById(parseInt(id));
  }
  @Get('tree')
  findAl() {
    return this.noticiasService.getTreeNoticie();
  }
  @Get('all')
  getNoticiasForUser() {
    //return this.noticiasService.getNoticiasForUser();
  }
  /**********************************************************************************************************/
  @Post('create-noticia-test')
  @UseInterceptors(FilesInterceptor('images'))
  createNoticiaTest(@Body() data, @UploadedFiles() files: Array<Express.Multer.File>) {
    let dataNotice: { position: number, type: string, content: string }[] = JSON.parse(data.data);
    return this.noticiasService.createNewNotice(dataNotice, files, data.fecha, data.autor)
  }
  @Patch('update-noticia/:id')
  @UseInterceptors(FilesInterceptor('images'))
  updateNoticia(@Param('id') idNoticia: string, @UploadedFiles() files:Array<Express.Multer.File>, @Body() data) {
    return this.noticiasService.updateNoticia(+idNoticia, JSON.parse(data.data),files);
  }
  /**********************************************************************************************************/
  @Post('desactivate/:id')
  desactivateNoticia(@Param('id') idNoticia: string) {
    return this.noticiasService.desactivateNoticia(parseInt(idNoticia));
  }
  @Post('activate/:id')
  activateNoticia(@Param('id') idNoticia: string) {
    return this.noticiasService.activateNoticia(parseInt(idNoticia));
  }
  @Delete('delete/:id')
  deleteNoticia(@Param('id') idNoticia: string) {
    return this.noticiasService.deleteNoticia(parseInt(idNoticia));
  }
/**********************************************************************************************************/
  @Patch('update-img/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  editImgNoticia(@Param('id') id: number, @UploadedFile() imagen: Express.Multer.File) {
    //return this.noticiasService.editImgNoticia(id,imagen);
  }
}
