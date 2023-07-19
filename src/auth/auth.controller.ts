import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.createUser(createUserDto);
    return {
      ok: true,
      method: 'POST',
      token,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return {
      ok: true,
      method: 'POST',
      token,
    };
  }

  @Get('private')
  @UseGuards(AuthGuard())
  async testPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @RawHeaders('User-Agent') userAgent: string,
  ) {
    return {
      ok: true,
      method: 'GET',
      message: 'Working',
      user,
      userEmail,
      rawHeaders,
      userAgent,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  async testPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      method: 'GET',
      message: 'Working',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  async testPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      method: 'GET',
      message: 'Working',
      user,
    };
  }
}
