import { PartialType } from '@nestjs/swagger';
import { CreateDetailproductDto } from './create-detailproduct.dto';

export class UpdateDetailproductDto extends PartialType(CreateDetailproductDto) {}
