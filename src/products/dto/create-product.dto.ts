import {
  IsString,
  MinLength,
  IsInt,
  IsPositive,
  Min,
  IsOptional,
  IsNumber,
  IsArray,
  IsIn,
} from 'class-validator';
export class CreateProductDto {
  @IsString({ message: 'El titulo del producto debe ser una cadena de texto' })
  @MinLength(3, {
    message: 'El titulo del producto debe tener al menos 3 carácteres',
  })
  readonly title: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  readonly price?: number;

  @IsOptional()
  @IsString({
    message: 'La descripción del producto debe ser una cadena de texto',
  })
  readonly description?: string;

  @IsOptional()
  @IsString({
    message: 'El slug del producto debe ser una cadena de texto',
  })
  readonly slug?: string;

  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número' })
  @Min(0, {
    message: 'El número del pokemon debe ser mayor o igual a 0',
  })
  readonly stock?: number;

  @IsString({ each: true })
  @IsArray()
  readonly sizes: string[];

  @IsString({ message: 'El tipo del producto debe ser una cadena de texto' })
  @MinLength(3, {
    message: 'El tipo del producto debe tener al menos 3 carácteres',
  })
  readonly type: string;

  @IsIn(['men', 'women', 'kid', 'unisex'], {
    message:
      'El género del producto debe ser una cadena de texto valida:"men", "women", "kid", "unisex" ',
  })
  @MinLength(3, {
    message: 'El género del producto debe tener al menos 3 carácteres',
  })
  readonly gender: string;

  @IsString({ each: true })
  @IsArray()
  readonly tags: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly images?: string[];
}
