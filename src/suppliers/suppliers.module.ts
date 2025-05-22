import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, PrismaService],
})
export class SuppliersModule {}
