import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcountsService } from './acounts.service';
import { CreateAcountDto } from './dto/create-acount.dto';
import { UpdateAcountDto } from './dto/update-acount.dto';
import { Login } from './interfaces/login.interface';

@Controller('acounts')
export class AcountsController {
  constructor(private readonly acountsService: AcountsService) {}

  @Get('get-admins')
  getAdmins(){
    return this.acountsService.getAdmins();
  }

  @Post('create-admin')
  createAdmin(@Body()dataAdmin:CreateAcountDto){
    return this.acountsService.createAdmin(dataAdmin);
  }
  @Post('login')
  loginAdmin(@Body()data:Login){
    return this.acountsService.loginAdmin(data);
  }
  @Post('rol')
  checkRol(@Body()data:{id:string}){
    return this.acountsService.checkRol(parseInt(data.id));
  }
  @Post('get-data')
  getDataByAdmin(@Body()data:{id:string}){
    return this.acountsService.getFDataProfile(parseInt(data.id));
  }
  @Delete('delete-admin/:id')
  deleteAdmin(@Param('id')id:string){
    return this.acountsService.deleteAdmin(parseInt(id))
  }
  @Post('desactivate-admin')
  desactivateAdmin(@Body()data:{id:string}){
    return this.acountsService.desactivateAdmin(parseInt(data.id))
  }
  @Post('activate-admin')
  activateAdmin(@Body()data:{id:string}){
    return this.acountsService.activateAdmin(parseInt(data.id))
  }
}
