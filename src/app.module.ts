import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CheckTokenStategy } from './modules/auth/token/token-stategy';
import { ImageModule } from './modules/image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommentsModule } from './modules/comments/comments.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload',
    }),
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    ImageModule,
    CommentsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService, CheckTokenStategy],
})
export class AppModule {}
