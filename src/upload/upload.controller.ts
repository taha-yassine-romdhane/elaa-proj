import { Controller, Post, UploadedFile, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { multerConfig } from '../config/multer.config';
import { PrismaService } from '../prisma.service';

@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
  constructor(private prisma: PrismaService) {}

  @Post('product/:productId/image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiOperation({ summary: 'Upload product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product image file',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  async uploadProductImage(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    const image = await this.prisma.productImage.create({
      data: {
        url: `/uploads/${file.filename}`,
        isMain: false,
        product: { connect: { id: productId } }
      }
    });

    return {
      ...image,
      filename: file.filename
    };
  }
}
