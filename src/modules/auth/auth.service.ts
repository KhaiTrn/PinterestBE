import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';

@Injectable()
export class AuthService {
  constructor(
    public prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { email, password, fullname } = createUserDto;
    const userExist = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    console.log(userExist);
    if (userExist) {
      throw new BadRequestException('Email was already taken,please try again');
    }
    const full_name = fullname ? fullname : '';
    const hashPassword = bcrypt.hashSync(password, 10);
    const userNew = await this.prisma.users.create({
      data: { email: email, password: hashPassword, full_name: full_name },
      select: { email: true },
    });

    return userNew;
  }
  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const isUserExist = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!isUserExist) {
      throw new BadRequestException('email is not exist, please register');
    }
    if (!isUserExist.password) {
      if (isUserExist.face_app_id) {
        throw new BadRequestException(
          'Plsease login with facebook to create new password',
        );
      }
      if (isUserExist.gooogle_id) {
        throw new BadRequestException(
          'Please login with google to create new password',
        );
      }
      throw new BadRequestException('Invalid,please contact customer service');
    }
    const isPasswordValid = bcrypt.compareSync(password, isUserExist.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('email or password is incorrect');
    }
    const token = this.createToken(isUserExist.user_id);
    return token;
  }
  async createToken(
    userID: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!userID) {
      throw new BadRequestException('userID is required');
    }
    const accessToken = this.jwt.sign(
      { userID },
      { secret: ACCESS_TOKEN_SECRET, expiresIn: ACCESS_TOKEN_EXPIRED },
    );
    const refreshToken = this.jwt.sign(
      { userID },
      { secret: REFRESH_TOKEN_SECRET, expiresIn: REFRESH_TOKEN_EXPIRED },
    );
    return { accessToken, refreshToken };
  }
}
