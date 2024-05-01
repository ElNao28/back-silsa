import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { CreateSendEmailDto } from './dto/create-send-email.dto';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}
  @Post()
  sendEmailByContact(@Body()data:CreateSendEmailDto) {
    return this.sendEmailService.sendEmailByContact(data);
  }
}
