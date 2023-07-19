import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, email, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      return this.generateJWT({ id: user.id });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
        select: { id: true, email: true, password: true },
      });
      if (!user) throw new NotFoundException('User not found');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException("Password didn't match our records");

      return this.generateJWT({ id: user.id });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private generateJWT(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error: any) {
    if (error.status === 404) throw error;
    if (error.status === 401) throw error;
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
