import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      ok: true,
      method: 'POST',
      product,
    };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const products = await this.productsService.findAll(pagination);
    return {
      ok: true,
      method: 'GET',
      products,
    };
  }

  @Get(':search')
  async findOne(@Param('search') search: string) {
    const product = await this.productsService.findOnePlain(search);
    return {
      ok: true,
      method: 'GET',
      product,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      ok: true,
      method: 'PATCH',
      product,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productsService.remove(id);
    return {
      ok: true,
      method: 'DELETE',
      product,
    };
  }
}
