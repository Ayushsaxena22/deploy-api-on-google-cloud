import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  // Product name must be provided and cannot be an empty string.
  @IsString()
  @IsNotEmpty()
  name!: string;

  // Price is converted to a number and must be zero or greater.
  @Type(() => Number)
  @IsNumber({}, { message: 'price must be a number' })
  @Min(0)
  price!: number;

  // Description is optional but must be a string when present.
  @IsOptional()
  @IsString()
  description?: string;
}
