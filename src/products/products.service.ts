import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const productData: any = {
      name: createProductDto.name,
      price: createProductDto.price,
      supplier: { connect: { id: createProductDto.supplierId } },
      category: { connect: { id: createProductDto.categoryId } }
    };

    // Only add optional fields if they exist
    if (createProductDto.description) productData.description = createProductDto.description;
    if (createProductDto.color) productData.color = createProductDto.color;

    return this.prisma.product.create({
      data: productData
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { supplier: true, category: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { supplier: true, category: true }
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        color: updateProductDto.color,
        ...(updateProductDto.supplierId && { 
          supplier: { connect: { id: updateProductDto.supplierId } }
        }),
        ...(updateProductDto.categoryId && {
          category: { connect: { id: updateProductDto.categoryId } }
        })
      }
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getProductImages(productId: number) {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { isMain: 'desc' } // Main image first
    });
  }

  async setMainImage(productId: number, imageId: number) {
    await this.prisma.productImage.updateMany({
      where: { productId },
      data: { isMain: false }
    });
    
    return this.prisma.productImage.update({
      where: { id: imageId },
      data: { isMain: true }
    });
  }

  async findByColor(color: string) {
    return this.prisma.product.findMany({
      where: { 
        color,
        isDeleted: false 
      },
      include: { 
        images: true,
        category: true,
        brand: true
      }
    });
  }

  async findByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: { 
        categoryId,
        isDeleted: false 
      },
      include: { 
        images: true,
        category: true,
        brand: true
      }
    });
  }

  async findByBrand(brandId: number) {
    return this.prisma.product.findMany({
      where: { 
        brandId,
        isDeleted: false 
      },
      include: { 
        images: true,
        category: true,
        brand: true
      }
    });
  }
}
