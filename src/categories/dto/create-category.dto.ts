import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  name: string;
  
  @ApiProperty({ required: false })
  description?: string;
}
