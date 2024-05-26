import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileHashModule } from '../../file-hash/file-hash.module';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import {
  I_MAPPER_TOKEN,
  I_USER_ORDER_REPOSITORY_TOKEN,
} from './constants/ioc.constants';
import { UserOrderMapper } from './domain/mapper/user-order.mapper';
import {
  UserOrderEntity,
  UserOrderSchema,
} from './infra/database/entities/user-order.entity';
import { UserOrderRepository } from './infra/database/repositories/user-order.repository';
import { UserOrderController } from './presentation/user-order.controller';

@Module({
  imports: [
    UsecasesProxyModule.register(),
    FileHashModule,
    MongooseModule.forFeature([
      {
        name: UserOrderEntity.name,
        schema: UserOrderSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: I_USER_ORDER_REPOSITORY_TOKEN,
      useClass: UserOrderRepository,
    },
    {
      provide: I_MAPPER_TOKEN,
      useClass: UserOrderMapper,
    },
  ],
  controllers: [UserOrderController],
  exports: [I_USER_ORDER_REPOSITORY_TOKEN, I_MAPPER_TOKEN],
})
export class UserOrderModule {}
