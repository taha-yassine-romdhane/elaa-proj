import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.$transaction(async (prisma) => {
      const total = createOrderDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const order = await prisma.order.create({
        data: {
          userId: createOrderDto.userId,
          deliveryPersonId: createOrderDto.deliveryPersonId,
          status: OrderStatus.PENDING,
          total,
        },
      });

      await prisma.orderItem.createMany({
        data: createOrderDto.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          sizeId: item.sizeId,
        })),
      });

      return prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: true, user: true, deliveryPerson: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
        deliveryPersonId: updateOrderDto.deliveryPersonId,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
