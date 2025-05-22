import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
