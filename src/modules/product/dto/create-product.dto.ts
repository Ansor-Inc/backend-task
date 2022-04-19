import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { City } from '../constants/product.enum';

export class CreateProductDto {
  @ApiProperty({
    required: false,
  })
  @IsArray()
  img_src: string[];

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    enum: City,
  })
  @IsEnum(City)
  city: City;

  @ApiProperty()
  @IsNumber()
  categoryId: number;
}
