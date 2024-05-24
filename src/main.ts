import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './application/interceptors/transform.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { BASE_PATH } from './application/constants/constants';
import { GeneralErrorFilter } from './application/filters/http-exception.filter';

async function bootstrap() {

const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');

  app.useGlobalFilters(new GeneralErrorFilter(logger));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix(BASE_PATH);

  await app.listen(3000);
}
bootstrap();
