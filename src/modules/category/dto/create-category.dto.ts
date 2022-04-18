import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsOptional({ always: true })
  @IsNumber()
  parentId?: number;

  @IsString()
  title: string;
}
