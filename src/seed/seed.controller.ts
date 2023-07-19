import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  async runSeed() {
    const message = await this.seedService.runSeed();
    return {
      ok: true,
      method: 'GET',
      message,
    };
  }
}
