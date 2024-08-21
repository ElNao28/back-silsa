import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  @Get()
  findAll() {
    return this.noticiasService.getNoticiasForAdmin();
  }
  @Get('tree')
  findAl() {
    return this.noticiasService.getTreeNoticie();
  }
  @Get('all')
  getNoticiasForUser() {
    return this.noticiasService.getNoticiasForUser();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticiasService.getNoticiaById(parseInt(id));
  }
  @Post('create-noticia-test')
  @UseInterceptors(
    FilesInterceptor('images')
  )
  createNoticiaTest(@Body() data, @UploadedFiles()files:Array<Express.Multer.File>) {
    let dataNotice:{position:number,type:string, content:string}[] = JSON.parse(data.data);
    return this.noticiasService.createNewNotice(dataNotice,files,data.fecha,data.autor)
  }

  
  @Post('desactivate/:id')
  desactivateNoticia(@Param('id')idNoticia:string){
    return this.noticiasService.desactivateNoticia(parseInt(idNoticia));
  }
  @Post('activate/:id')
  activateNoticia(@Param('id')idNoticia:string){
    return this.noticiasService.activateNoticia(parseInt(idNoticia));
  }
  @Delete('delete/:id')
  deleteNoticia(@Param('id')idNoticia:string){
    return this.noticiasService.deleteNoticia(parseInt(idNoticia));
  }
  @Patch('update-noticia/:id')
  updateNoticia(@Param('id')idNoticia:string,@Body()dataNoticia:UpdateNoticiaDto){
    return this.noticiasService.updateNoticia(parseInt(idNoticia),dataNoticia);
  }
  @Patch('update-img/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  editImgNoticia(@Param('id')id:number,@UploadedFile() imagen: Express.Multer.File) {
    //return this.noticiasService.editImgNoticia(id,imagen);
  }
}
