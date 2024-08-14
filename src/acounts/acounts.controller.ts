import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AcountsService } from './acounts.service';
import { CreateAcountDto } from './dto/create-acount.dto';
import { Login } from './interfaces/login.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('acounts')
export class AcountsController {
  constructor(private readonly acountsService: AcountsService) { }

  @Get('get-admins')
  getAdmins() {
    return this.acountsService.getAdmins();
  }

  @Post('create-admin')
  @UseInterceptors(FileInterceptor('imagen'))
  createAdmin(@Body() dataAdmin: CreateAcountDto, @UploadedFile() file: Express.Multer.File) {
    return this.acountsService.createAdmin(dataAdmin,file);
  }
  @Post('login')
  loginAdmin(@Body() data: Login) {
    return this.acountsService.loginAdmin(data);
  }
  @Post('rol')
  checkRol(@Body() data: { id: string }) {
    return this.acountsService.checkRol(parseInt(data.id));
  }
  @Post('get-data')
  getDataByAdmin(@Body() data: { id: string }) {
    return this.acountsService.getFDataProfile(parseInt(data.id));
  }
  @Delete('delete-admin/:id')
  deleteAdmin(@Param('id') id: string) {
    return this.acountsService.deleteAdmin(parseInt(id))
  }
  @Post('desactivate-admin')
  desactivateAdmin(@Body() data: { id: string }) {
    return this.acountsService.desactivateAdmin(parseInt(data.id))
  }
  @Post('activate-admin')
  activateAdmin(@Body() data: { id: string }) {
    return this.acountsService.activateAdmin(parseInt(data.id))
  }
  @Patch('update-photo/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  updatePhothoAdmin(@Param('id') id: string, @UploadedFile() img: Express.Multer.File) {
    return this.acountsService.updatePhothoAdmin(parseInt(id), img);
  }
}
