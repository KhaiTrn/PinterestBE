import { Global, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
