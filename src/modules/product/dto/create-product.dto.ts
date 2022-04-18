import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsArray()
  img_src: string[];

  @IsString()
  title: string;

  @IsString()
  price: string;

  @IsString()
  description: string;

  @IsString()
  city: string;

  @IsNumber()
  categoryId: number;
}
