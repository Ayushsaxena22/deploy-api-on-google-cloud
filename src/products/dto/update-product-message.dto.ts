import { IsMongoId } from 'class-validator';
import { UpdateProductDto } from './update-product.dto';

export class UpdateProductMessageDto extends UpdateProductDto {
  @IsMongoId()
  id!: string;
}