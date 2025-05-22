import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Brand } from '@prisma/client';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Brand created successfully' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List of all brands' })
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Brand details' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Brand updated successfully' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Brand deleted successfully' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
