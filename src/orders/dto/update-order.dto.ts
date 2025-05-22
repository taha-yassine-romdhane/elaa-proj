import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ enum: OrderStatus })
  status?: OrderStatus;
}
