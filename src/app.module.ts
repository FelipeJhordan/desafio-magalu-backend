import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { getConfiguration } from './application/configuration/configuration';
import { UserOrderModule } from './core/user-order/user-order.module';
import { FileHashModule } from './file-hash/file-hash.module';
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
    UserOrderModule,
    HealthModule,
    FileHashModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
