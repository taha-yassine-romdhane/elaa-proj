import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { Product } from '@prisma/client';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: ReturnType<typeof mockDeep<PrismaService>>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product with required fields', async () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Test Product',
      price: new Decimal(10.99),
      supplierId: 1,
      categoryId: 1,
      brandId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: null,
      description: null,
      isDeleted: false
    };

    prisma.product.create.mockResolvedValue(mockProduct);

    const result = await service.create({
      name: 'Test Product',
      price: 10.99,
      supplierId: 1,
      categoryId: 1
    });

    expect(result).toEqual(mockProduct);
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Product',
        price: 10.99,
        supplier: { connect: { id: 1 } },
        category: { connect: { id: 1 } }
      }
    });
  });

  it('should create a product with optional fields', async () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Test Product',
      price: new Decimal(10.99),
      description: 'Test Description',
      color: 'Red',
      supplierId: 1,
      categoryId: 1,
      brandId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };

    prisma.product.create.mockResolvedValue(mockProduct);

    const result = await service.create({
      name: 'Test Product',
      price: 10.99,
      description: 'Test Description',
      color: 'Red',
      supplierId: 1,
      categoryId: 1
    });

    expect(result).toEqual(mockProduct);
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Product',
        price: 10.99,
        description: 'Test Description',
        color: 'Red',
        supplier: { connect: { id: 1 } },
        category: { connect: { id: 1 } }
      }
    });
  });
});