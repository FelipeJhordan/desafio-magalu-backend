import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './application/interceptors/transform.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { BASE_PATH } from './application/constants/constants';
import { GeneralErrorFilter } from './application/filters/http-exception.filter';
import { getConfiguration } from './application/configuration/configuration';

async function bootstrap() {
  const PORT = getConfiguration().PORT;
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');

  app.useGlobalFilters(new GeneralErrorFilter(logger));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix(BASE_PATH);

  await app.listen(PORT);

  logger.log(`Application server on in port ${PORT}`);
}
bootstrap();
