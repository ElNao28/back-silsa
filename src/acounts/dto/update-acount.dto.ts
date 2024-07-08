import { PartialType } from '@nestjs/mapped-types';
import { CreateAcountDto } from './create-acount.dto';

export class UpdateAcountDto extends PartialType(CreateAcountDto) {}
