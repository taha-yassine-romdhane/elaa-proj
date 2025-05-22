import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Get(':id/images')
  getProductImages(@Param('id') id: string) {
    return this.productsService.getProductImages(+id);
  }

  @Get('by-color')
  @ApiQuery({ name: 'color', required: true })
  async findByColor(@Query('color') color: string) {
    return this.productsService.findByColor(color);
  }

  @Get('by-category')
  @ApiQuery({ name: 'categoryId', required: true, type: Number })
  async findByCategory(@Query('categoryId') categoryId: number) {
    return this.productsService.findByCategory(categoryId);
  }

  @Get('by-brand')
  @ApiQuery({ name: 'brandId', required: true, type: Number })
  async findByBrand(@Query('brandId') brandId: number) {
    return this.productsService.findByBrand(brandId);
  }
}
