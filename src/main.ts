import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './application/interceptors/transform.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GeneralErrorFilter } from './application/filters/http-exception.filter';
import { getConfiguration } from './application/configuration/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const { APPLICATION_TITLE, PORT, APPLICATION_VERSION } = getConfiguration();

  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');

  app.useGlobalFilters(new GeneralErrorFilter(logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix(`api/${APPLICATION_VERSION}`);

  const config = new DocumentBuilder()
    .setTitle(APPLICATION_TITLE)
    .setVersion(APPLICATION_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`api/${APPLICATION_VERSION}/docs`, app, document);

  await app.listen(PORT);

  logger.log(`Application server on in port ${PORT}`);
}
bootstrap();
