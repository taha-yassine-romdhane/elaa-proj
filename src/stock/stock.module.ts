import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [StockService, PrismaService],
  controllers: [StockController],
})
export class StockModule {}
