import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcountsService } from './acounts.service';
import { CreateAcountDto } from './dto/create-acount.dto';
import { UpdateAcountDto } from './dto/update-acount.dto';
import { Login } from './interfaces/login.interface';

@Controller('acounts')
export class AcountsController {
  constructor(private readonly acountsService: AcountsService) {}

  @Post('login')
  loginAdmin(@Body()data:Login){
    return this.acountsService.loginAdmin(data);
  }
  @Post('rol')
  checkRol(@Body()data:{id:string}){
    return this.acountsService.checkRol(parseInt(data.id));
  }
}
