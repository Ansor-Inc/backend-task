import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional({ always: true })
  @IsNumber()
  parentId?: number;

  @ApiProperty()
  @IsString()
  title: string;
}
