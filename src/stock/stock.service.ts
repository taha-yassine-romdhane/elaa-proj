import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  // Get stock by product ID (per size and total)
  async getStockByProductId(productId: number) {
    // Get all sizes for the product
    const sizes = await this.prisma.productSize.findMany({
      where: { productId },
      select: { id: true, name: true, stock: true },
    });
    const totalStock = sizes.reduce((sum, size) => sum + size.stock, 0);
    return { productId, sizes, totalStock };
  }

  // Get stock by product name (per size and total)
  async getStockByProductName(productName: string) {
    const product = await this.prisma.product.findFirst({
      where: { name: productName },
      select: { id: true },
    });
    if (!product) throw new Error('Product not found');
    return this.getStockByProductId(product.id);
  }

  // List all stock (all products with their sizes and stock)
  async listAllStock() {
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sizes: { select: { id: true, name: true, stock: true } },
      },
    });
    return products.map(product => ({
      productId: product.id,
      name: product.name,
      sizes: product.sizes,
      totalStock: product.sizes.reduce((sum, size) => sum + size.stock, 0),
    }));
  }

  // Update stock for a specific ProductSize
  async updateStock(sizeId: number, newStock: number) {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    const updated = await this.prisma.productSize.update({
      where: { id: sizeId },
      data: { stock: newStock },
      select: { id: true, name: true, stock: true, productId: true },
    });
    return updated;
  }



  // Get all sizes for a product by id
  async getSizesByProductId(productId: number) {
    const sizes = await this.prisma.productSize.findMany({
      where: { productId },
      select: { id: true, name: true, stock: true },
    });
    return sizes;
  }

  // Get all sizes for a product by name
  async getSizesByProductName(productName: string) {
    const product = await this.prisma.product.findFirst({
      where: { name: productName },
      select: { id: true },
    });
    if (!product) throw new Error('Product not found');
    return this.getSizesByProductId(product.id);
  }

  // Update stock by product (id or name) and size (id or name)
  async updateStockByProductAndSize(params: {
    productId?: number;
    productName?: string;
    sizeId?: number;
    sizeName?: string;
    newStock: number;
  }) {
    const { productId, productName, sizeId, sizeName, newStock } = params;
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    let resolvedProductId = productId;
    if (!resolvedProductId && productName) {
      const product = await this.prisma.product.findFirst({
        where: { name: productName },
        select: { id: true },
      });
      if (!product) throw new Error('Product not found');
      resolvedProductId = product.id;
    }
    if (!resolvedProductId) throw new Error('Product id or name required');

    let resolvedSizeId = sizeId;
    if (!resolvedSizeId && sizeName) {
      const size = await this.prisma.productSize.findFirst({
        where: { productId: resolvedProductId, name: sizeName },
        select: { id: true },
      });
      if (!size) throw new Error('Size not found for this product');
      resolvedSizeId = size.id;
    }
    if (!resolvedSizeId) throw new Error('Size id or name required');

    const updated = await this.prisma.productSize.update({
      where: { id: resolvedSizeId },
      data: { stock: newStock },
      select: { id: true, name: true, stock: true, productId: true },
    });
    return updated;
  }
}



