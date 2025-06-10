import { Controller, Get, Param, NotFoundException, Put, Body, BadRequestException } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) { }

    // GET /stock/id/:id
    @Get('id/:id')
    async getStockByProductId(@Param('id') id: string) {
        const result = await this.stockService.getStockByProductId(Number(id));
        if (!result || result.sizes.length === 0) {
            throw new NotFoundException('Product or stock not found');
        }
        return result;
    }

    // GET /stock/name/:name
    @Get('name/:name')
    async getStockByProductName(@Param('name') name: string) {
        const result = await this.stockService.getStockByProductName(name);
        if (!result) {
            throw new NotFoundException('Product not found');
        }
        return result;
    }

    // GET /stock
    @Get()
    async getAllStock() {
        return this.stockService.listAllStock();
    }

    // PUT /stock/size/:sizeId
    @Put('size/:sizeId')
    async updateStock(
        @Param('sizeId') sizeId: string,
        @Body('newStock') newStock: number
    ) {
        try {
            const updated = await this.stockService.updateStock(Number(sizeId), newStock);
            return updated;
        } catch (error) {
            if (error.message === 'Stock cannot be negative') {
                throw new BadRequestException(error.message);
            }
            throw new NotFoundException('Product size not found');
        }
    }

    // PUT /stock/update-by-product
    @Put('update-by-product')
    async updateStockByProductAndSize(
        @Body() body: {
            productId?: number;
            productName?: string;
            sizeId?: number;
            sizeName?: string;
            newStock: number;
        }
    ) {
        try {
            const updated = await this.stockService.updateStockByProductAndSize(body);
            return updated;
        } catch (error) {
            if (error.message === 'Stock cannot be negative') {
                throw new BadRequestException(error.message);
            }
            if (error.message === 'Product not found' || error.message === 'Product id or name required') {
                throw new NotFoundException(error.message);
            }
            if (error.message === 'Size not found for this product' || error.message === 'Size id or name required') {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    // GET /stock/sizes/by-product-id/:id
    @Get('sizes/by-product-id/:id')
    async getSizesByProductId(@Param('id') id: string) {
        const sizes = await this.stockService.getSizesByProductId(Number(id));
        if (!sizes || sizes.length === 0) {
            throw new NotFoundException('No sizes found for this product');
        }
        return sizes;
    }

    // GET /stock/sizes/by-product-name/:name
    @Get('sizes/by-product-name/:name')
    async getSizesByProductName(@Param('name') name: string) {
        const sizes = await this.stockService.getSizesByProductName(name);
        if (!sizes || sizes.length === 0) {
            throw new NotFoundException('No sizes found for this product');
        }
        return sizes;
    }
}
