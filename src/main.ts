import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global/filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new GlobalExceptionFilter(app));
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || '*',
  });
  await app.listen(3000);
}
bootstrap();
