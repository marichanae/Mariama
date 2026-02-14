import { IsEnum, IsNumber, IsOptional, IsString, MinLength, IsUrl } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsString()
  categoryId!: string;

  @IsNumber()
  price!: number;

  @IsEnum(ProductType)
  type!: ProductType;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
