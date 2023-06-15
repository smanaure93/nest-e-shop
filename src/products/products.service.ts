import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const { limit = 2, offset = 0 } = pagination;
      const products = this.productRepository.find({
        take: limit,
        skip: offset,
      });
      return products;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(search: string) {
    try {
      let product: Product;
      if (isUUID(search)) {
        product = await this.productRepository.findOne({
          where: { id: search },
        });
      } else {
        const query = this.productRepository.createQueryBuilder();
        product = await query
          .where(`UPPER(title) = :title or slug = :slug`, {
            title: search.toUpperCase(),
            slug: search.toLowerCase(),
          })
          .getOne();
      }
      if (!product) {
        throw new NotFoundException(
          `El termino ${search} no arrojó ningún resultado`,
        );
      }
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto,
      });
      if (!product) {
        throw new NotFoundException(`El id ${id} no arrojó ningún resultado`);
      }
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.status === 404) throw error;
    if (error.code === '23505') {
      this.logger.error(error.detail);
      throw new BadRequestException(
        `Ocurrió un error de duplicidad al crear el producto: ${error.detail}`,
      );
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Ocurrió un error en la operación, contacte a soporte',
    );
  }
}
