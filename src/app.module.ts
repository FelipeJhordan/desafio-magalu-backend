import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrderModule } from './core/order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  environment,
  getConfiguration,
} from './application/configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration],
      expandVariables: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: environment.DATABASE_URI,
      }),
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
