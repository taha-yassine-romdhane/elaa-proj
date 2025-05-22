import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  create(createBrandDto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: createBrandDto
    });
  }

  async findAll() {
    return this.prisma.brand.findMany({
      where: { isDeleted: false }
    });
  }

  async findOne(id: number) {
    return this.prisma.brand.findFirst({
      where: { 
        id,
        isDeleted: false 
      }
    });
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto
    });
  }

  async remove(id: number) {
    return this.prisma.brand.update({
      where: { id },
      data: { isDeleted: true }
    });
  }
}
