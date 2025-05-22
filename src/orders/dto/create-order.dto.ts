import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty()
  userId: number;
  
  @ApiProperty()
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    sizeId?: number;
  }>;
  
  @ApiProperty({ required: false })
  deliveryPersonId?: number;
}
