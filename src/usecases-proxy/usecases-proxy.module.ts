import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from '../application/patterns/usecase-proxy';
import {
  I_MAPPER_TOKEN,
  I_USER_ORDER_REPOSITORY_TOKEN,
} from '../core/user-order/constants/ioc.constants';
import { UserOrderMapper } from '../core/user-order/domain/mapper/user-order.mapper';
import { GetUserOrderUsecase } from '../core/user-order/domain/usecases/get-user-order.usecase';
import { TransformAndSaveUserOrderUsecaseProxy } from '../core/user-order/domain/usecases/transform-file-and-save-orders.usecase';
import { UserOrderRepository } from '../core/user-order/infra/database/repositories/user-order.repository';
import { UserOrderModule } from '../core/user-order/user-order.module';
import {
  I_FILE_HASH_REPOSITORY_TOKEN,
  I_HASH_ADAPTER_TOKEN,
} from '../file-hash/constants/ioc/ioc.constants';
import { GenerateFileHashUseCase } from '../file-hash/domain/usecases/generate-file-hash.usecase';
import { HasFileHashUsecase } from '../file-hash/domain/usecases/has-file-hash.usecase';
import { SaveFileHashUsacase } from '../file-hash/domain/usecases/save-file-hash.usecase';
import { FileHashModule } from '../file-hash/file-hash.module';
import { FileHashRepository } from '../file-hash/infra/database/repositories/file-hash.repository';
import { HashAdapter } from '../file-hash/infra/hash/hash.adapter';

@Module({})
export class UsecasesProxyModule {
  static TRANSFORM_FILE_AND_SAVE_ORDERS_USECASE_PROXY =
    'TransformFileAndSaveOrdersUsecaseProxy';

  static GET_USER_ORDER_USECASE_PROXY = 'GetUserOrderUsecaseProxy';

  static HAS_FILE_HASH_USECASE_PROXY = 'HasFileHashUsecaseProxy';

  static SAVE_FILE_HASH_USECASE_PROXY = 'SaveFileHashUsecaseProxy';

  static GENERATE_FILE_HASH_USECASE_PROXY = 'GenerateFileHashUsecaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          provide: UsecasesProxyModule.GET_USER_ORDER_USECASE_PROXY,
          inject: [I_USER_ORDER_REPOSITORY_TOKEN],
          useFactory: (repository: UserOrderRepository) =>
            new UseCaseProxy(new GetUserOrderUsecase(repository)),
        },
        {
          provide:
            UsecasesProxyModule.TRANSFORM_FILE_AND_SAVE_ORDERS_USECASE_PROXY,
          inject: [I_USER_ORDER_REPOSITORY_TOKEN, I_MAPPER_TOKEN],
          useFactory: (
            repository: UserOrderRepository,
            mapper: UserOrderMapper,
          ) =>
            new UseCaseProxy(
              new TransformAndSaveUserOrderUsecaseProxy(repository, mapper),
            ),
        },
        {
          provide: UsecasesProxyModule.HAS_FILE_HASH_USECASE_PROXY,
          inject: [I_FILE_HASH_REPOSITORY_TOKEN],
          useFactory: (repository: FileHashRepository) =>
            new UseCaseProxy(new HasFileHashUsecase(repository)),
        },
        {
          provide: UsecasesProxyModule.SAVE_FILE_HASH_USECASE_PROXY,
          inject: [I_FILE_HASH_REPOSITORY_TOKEN],
          useFactory: (repository: FileHashRepository) =>
            new UseCaseProxy(new SaveFileHashUsacase(repository)),
        },
        {
          provide: UsecasesProxyModule.GENERATE_FILE_HASH_USECASE_PROXY,
          inject: [I_HASH_ADAPTER_TOKEN],
          useFactory: (hashAdapter: HashAdapter) =>
            new UseCaseProxy(new GenerateFileHashUseCase(hashAdapter)),
        },
      ],
      exports: [
        UsecasesProxyModule.GET_USER_ORDER_USECASE_PROXY,
        UsecasesProxyModule.TRANSFORM_FILE_AND_SAVE_ORDERS_USECASE_PROXY,
        UsecasesProxyModule.HAS_FILE_HASH_USECASE_PROXY,
        UsecasesProxyModule.SAVE_FILE_HASH_USECASE_PROXY,
        UsecasesProxyModule.GENERATE_FILE_HASH_USECASE_PROXY,
      ],
      imports: [UserOrderModule, FileHashModule],
    };
  }
}
