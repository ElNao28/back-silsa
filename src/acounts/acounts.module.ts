import { Module } from '@nestjs/common';
import { AcountsService } from './acounts.service';
import { AcountsController } from './acounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acount } from './entities/acount.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Acount])],
  controllers: [AcountsController],
  providers: [AcountsService],
})
export class AcountsModule {}
