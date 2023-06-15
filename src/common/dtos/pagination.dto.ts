import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt({
    message: 'El limite debe ser un número entero',
  })
  @Min(1, {
    message: 'El limite debe ser positivo y mayor a 0',
  })
  readonly limit?: number;

  @IsOptional()
  @IsInt({
    message: 'El offset debe ser un número entero',
  })
  @Min(0, {
    message: 'El offset debe ser positivo',
  })
  readonly offset?: number;
}
