import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      select: {
        user_id: true,
        email: true,
        age: true,
        full_name: true,
        avatar: true,
        created_at: true,
        update_at: true,
      },
    });

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { user_id: id } });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
