import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async findAll() {
    return this.prisma.supplier.findMany();
  }

  async findOne(id: number) {
    return this.prisma.supplier.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: number) {
    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
