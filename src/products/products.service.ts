import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const { limit = 2, offset = 0 } = pagination;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
      return products.map((product) => ({
        ...product,
        images: product.images.map((img) => img.url),
      }));
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(search: string) {
    try {
      let product: Product;
      if (isUUID(search)) {
        product = await this.productRepository.findOneBy({
          id: search,
        });
      } else {
        const query = this.productRepository.createQueryBuilder('prod');
        product = await query
          .where(`UPPER(title) = :title or slug = :slug`, {
            title: search.toUpperCase(),
            slug: search.toLowerCase(),
          })
          .leftJoinAndSelect('prod.images', 'prodImages')
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

  async findOnePlain(search: string) {
    try {
      const product = await this.findOne(search);
      return { ...product, images: product.images.map((img) => img.url) };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const { images, ...toUpdate } = updateProductDto;
      const product = await this.productRepository.preload({
        id,
        ...toUpdate,
      });
      if (!product) {
        throw new NotFoundException(`El id ${id} no arrojó ningún resultado`);
      }

      if (images) {
        await runner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await runner.manager.save(product);
      await runner.commitTransaction();
      await runner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await runner.rollbackTransaction();
      await runner.release();
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return { ...product, images: product.images.map((img) => img.url) };
    } catch (error) {
      await this.handleExceptions(error);
    }
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder();
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      await this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.status === 404) throw error;
    if (error.code === '23503') {
      this.logger.error(error.detail);
      throw new BadRequestException(
        `Ocurrió un error de clave foranea al eliminar: ${error.detail}`,
      );
    }
    if (error.code === '23505') {
      this.logger.error(error.detail);
      throw new BadRequestException(
        `Ocurrió un error de duplicidad al crear: ${error.detail}`,
      );
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Ocurrió un error en la operación, contacte a soporte',
    );
  }
}
