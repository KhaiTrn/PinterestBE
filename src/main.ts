import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TokenCheck } from './modules/auth/token/token-check';
import { ResponseSuccessInterceptor } from './interceptors/logging.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new TokenCheck(reflector));
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Pinterest')
    .setDescription('Pinterest Api')
    .setVersion('1.0')
    .build();
  const documentFacetory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFacetory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
