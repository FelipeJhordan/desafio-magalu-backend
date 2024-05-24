import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrderModule } from './core/order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getConfiguration } from './application/configuration/configuration';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration],
      expandVariables: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: getConfiguration().DATABASE_URI,
      }),
    }),
    OrderModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
