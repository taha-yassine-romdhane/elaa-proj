import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive, IsInt, MinLength, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;
  
  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  price: number;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;
  
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  supplierId: number;
  
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  categoryId: number;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsInt()
  @IsPositive()
  brandId?: number;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
  
  // Additional fields that might be sent from frontend but not directly used in Product model
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsInt()
  @IsPositive()
  stock?: number;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
