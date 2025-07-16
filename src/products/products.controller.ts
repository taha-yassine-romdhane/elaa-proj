import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      console.log('Received product data:', createProductDto);
      const result = await this.productsService.create(createProductDto);
      console.log('Product created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('Controller error creating product:', error);
      
      // If it's a validation error, provide more details
      if (error.response && error.response.message) {
        console.error('Validation error details:', error.response.message);
      }
      
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('test-connection')
  async testConnection() {
    try {
      const count = await this.productsService.count();
      const products = await this.productsService.getFirst10();
      return {
        status: 'success',
        totalProducts: count,
        first10Products: products
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  @Get('test-images')
  async testImages() {
    try {
      const productsWithImages = await this.productsService.findAll();
      return {
        status: 'success',
        productsWithImages,
        imageUrlGuide: {
          explanation: 'Image URLs should be accessible at these paths:',
          examples: [
            'Direct file: http://localhost:5000/uploads/filename.jpg',
            'Via assets: http://localhost:5000/assets/images/filename.jpg'
          ]
        }
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  @Get('check-files')
  async checkFiles() {
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const uploadsDir = path.join(publicDir, 'uploads');
      const assetsDir = path.join(publicDir, 'assets', 'images');
      
      const publicExists = fs.existsSync(publicDir);
      const uploadsExists = fs.existsSync(uploadsDir);
      const assetsExists = fs.existsSync(assetsDir);
      
      let uploadFiles: string[] = [];
      let assetFiles: string[] = [];
      
      if (uploadsExists) {
        uploadFiles = fs.readdirSync(uploadsDir).slice(0, 10); // First 10 files
      }
      
      if (assetsExists) {
        assetFiles = fs.readdirSync(assetsDir).slice(0, 10); // First 10 files
      }
      
      return {
        directories: {
          public: { path: publicDir, exists: publicExists },
          uploads: { path: uploadsDir, exists: uploadsExists },
          assets: { path: assetsDir, exists: assetsExists }
        },
        files: {
          uploads: uploadFiles,
          assets: assetFiles
        },
        staticUrls: {
          uploads: uploadFiles.map(file => `http://localhost:5000/uploads/${file}`),
          assets: assetFiles.map(file => `http://localhost:5000/assets/images/${file}`)
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('by-color')
  @ApiQuery({ name: 'color', required: true })
  async findByColor(@Query('color') color: string) {
    return this.productsService.findByColor(color);
  }

  @Get('by-category')
  @ApiQuery({ name: 'categoryId', required: true, type: Number })
  async findByCategory(@Query('categoryId') categoryId: number) {
    return this.productsService.findByCategory(+categoryId);
  }

  @Get('by-brand')
  @ApiQuery({ name: 'brandId', required: true, type: Number })
  async findByBrand(@Query('brandId') brandId: number) {
    return this.productsService.findByBrand(+brandId);
  }

  // Move specific routes BEFORE the :id route to prevent conflicts
  @Get(':id/images')
  getProductImages(@Param('id') id: string) {
    return this.productsService.getProductImages(+id);
  }
  
  @Get('debug/:id')
  async debugProduct(@Param('id') id: string) {
    try {
      const productId = +id;
      console.log(`Debugging product ${productId}...`);
      
      const product = await this.productsService.findOne(productId);
      
      if (!product) {
        return { error: 'Product not found' };
      }
      
      // Test if image URLs are accessible
      const imageTests = product.images?.map(img => ({
        url: img.url,
        isMain: img.isMain,
        fullUrl: `http://localhost:5000${img.url}`,
        localPath: `./public${img.url}`
      })) || [];
      
      return {
        product: {
          id: product.id,
          name: product.name,
          price: product.price
        },
        images: product.images,
        imageTests,
        totalImages: product.images?.length || 0
      };
    } catch (error) {
      console.error('Debug error:', error);
      return { error: error.message };
    }
  }

  @Get('fix-image-urls')
  async fixImageUrls() {
    try {
      // Get all products with images that have relative URLs
      const products = await this.productsService.findAll();
      const fixes: Array<{
        productId: number;
        productName: string;
        imageId: number;
        oldUrl: string;
        newUrl: string;
      }> = [];
      
      for (const product of products) {
        for (const image of product.images || []) {
          if (image.url.startsWith('/assets/') && !image.url.startsWith('http://')) {
            const oldUrl = image.url;
            const newUrl = `http://localhost:5000${image.url}`;
            
            // Update the image URL in database
            await this.prisma.productImage.update({
              where: { id: image.id },
              data: { url: newUrl }
            });
            
            fixes.push({
              productId: product.id,
              productName: product.name,
              imageId: image.id,
              oldUrl,
              newUrl
            });
          }
        }
      }
      
      return {
        message: `Fixed ${fixes.length} image URLs`,
        fixes
      };
    } catch (error) {
      console.error('Error fixing image URLs:', error);
      return { error: error.message };
    }
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async updatePut(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      console.log(`PUT - Updating product ${id} with data:`, updateProductDto);
      const result = await this.productsService.update(+id, updateProductDto);
      if (!result) {
        throw new HttpException('Product not found after update', HttpStatus.NOT_FOUND);
      }
      console.log('Product updated successfully via PUT:', result.id);
      return result;
    } catch (error) {
      console.error('Controller error updating product via PUT:', error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      console.log(`PATCH - Updating product ${id} with data:`, updateProductDto);
      const result = await this.productsService.update(+id, updateProductDto);
      if (!result) {
        throw new HttpException('Product not found after update', HttpStatus.NOT_FOUND);
      }
      console.log('Product updated successfully via PATCH:', result.id);
      return result;
    } catch (error) {
      console.error('Controller error updating product via PATCH:', error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
