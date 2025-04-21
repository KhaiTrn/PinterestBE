import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, isEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'email không hợp lệ' })
  @IsString()
  email: string;

  @IsString({ message: `trường password phải có` })
  password: string;
  @IsOptional()
  @ApiProperty({ required: false })
  fullname?: string;
}
