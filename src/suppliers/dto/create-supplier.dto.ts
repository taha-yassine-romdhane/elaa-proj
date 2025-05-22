import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  phone: string;
  
  @ApiProperty()
  address: string;
  
  @ApiProperty({ required: false })
  contactInfo?: string;
}
