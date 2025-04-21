import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/decorators/response-success.decorator';
import { application } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ResponseSuccess('Register successful')
  @Public()
  @ApiBody({
    schema: {
      example: {
        email: 'string',
        password: 'string',
        fullname: 'string',
      },
    },
  })
  @Post(`register`)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @ApiResponse({
    status: 400,
    description: 'BadRequestException',
  })
  @ResponseSuccess('Login successful')
  @Public()
  @Post(`login`)
  async login(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.login(createAuthDto);
  }
}
