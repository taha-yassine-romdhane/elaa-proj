import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  price: number;
  
  @ApiProperty({ required: false })
  description?: string;
  
  @ApiProperty({ required: false })
  color?: string;
  
  @ApiProperty()
  supplierId: number;
  
  @ApiProperty()
  categoryId: number;
  
  @ApiProperty({ required: false })
  imageUrl?: string;
}
