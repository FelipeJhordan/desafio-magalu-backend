import { Readable } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';

import { UserOrderController } from './user-order.controller';
import { TransformAndSaveUserOrderUsecaseProxy } from '../domain/usecases/transform-file-and-save-orders.usecase';
import { GetUserOrderUsecase } from '../domain/usecases/get-user-order.usecase';
import { GenerateFileHashUseCase } from '../../../file-hash/domain/usecases/generate-file-hash.usecase';
import { SaveFileHashUsacase } from '../../../file-hash/domain/usecases/save-file-hash.usecase';
import { HasFileHashUsecase } from '../../../file-hash/domain/usecases/has-file-hash.usecase';
import { UseCaseProxy } from '../../../application/patterns/usecase-proxy';
import { GetUserOrderFilterDto } from './dtos/get-user-order-filter.dto';
import { GetUserOrderResponseDto } from './dtos/get-user-order-response.dto';
import { UsecasesProxyModule } from '../../../usecases-proxy/usecases-proxy.module';
import { SaveOrdersBulkyResponseDto } from './dtos/save-orders-bulky-response.dto';
import * as configuration from '../../../application/configuration/configuration';
import { ConfigurationType } from '../../../application/configuration/type/configuration.type';

jest.mock('../../../usecases-proxy/usecases-proxy.module.ts', () => ({
  ...jest.requireActual('../../../usecases-proxy/usecases-proxy.module.ts'), // import and retain the original functionalities
  UsecasesProxyModule: {
    TRANSFORM_FILE_AND_SAVE_ORDERS_USECASE_PROXY:
      'TransformFileAndSaveOrdersUsecaseProxy',
    GET_USER_ORDER_USECASE_PROXY: 'GetUserOrderUsecaseProxy',
    GENERATE_FILE_HASH_USECASE_PROXY: 'GenerateFileHashUsecaseProxy',
    SAVE_FILE_HASH_USECASE_PROXY: 'SaveFileHashUsecaseProxy',
    HAS_FILE_HASH_USECASE_PROXY: 'HasFileHashUsecaseProxy',
    register: jest.fn(),
  },
}));

export const proxyMock = <T>(usecase: T) => ({
  getInstance: () => usecase,
});

export const hasFileHashUsecaseMock = proxyMock<HasFileHashUsecase>({
  execute: jest.fn(),
} as unknown as HasFileHashUsecase);
export const generateFileHashUsecaseMock = proxyMock<GenerateFileHashUseCase>({
  execute: jest.fn(),
} as unknown as GenerateFileHashUseCase);
export const saveFileHashUsecaseMock = proxyMock<SaveFileHashUsacase>({
  execute: jest.fn(),
} as unknown as SaveFileHashUsacase);
export const getUserOrderUsecaseMock = proxyMock<GetUserOrderUsecase>({
  execute: jest.fn(),
} as unknown as GetUserOrderUsecase);
export const transformAndSaveUserOrderUsecaseMock =
  proxyMock<TransformAndSaveUserOrderUsecaseProxy>({
    execute: jest.fn(),
  } as unknown as TransformAndSaveUserOrderUsecaseProxy);

export const UsecasesProxyModuleMock = {
  register: jest.fn(),
};

describe('UserOrderController', () => {
  let controller: UserOrderController;
  let transformAndSaveUserOrderUsecaseProxy: UseCaseProxy<TransformAndSaveUserOrderUsecaseProxy>;
  let hasFileHashUsecase: UseCaseProxy<HasFileHashUsecase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        UserOrderController,
        {
          provide: 'TransformFileAndSaveOrdersUsecaseProxy',
          useValue: transformAndSaveUserOrderUsecaseMock,
        },
        {
          provide: 'GetUserOrderUsecaseProxy',
          useValue: getUserOrderUsecaseMock,
        },
        {
          provide: 'GenerateFileHashUsecaseProxy',
          useValue: generateFileHashUsecaseMock,
        },
        {
          provide: 'SaveFileHashUsecaseProxy',
          useValue: saveFileHashUsecaseMock,
        },
        {
          provide: 'HasFileHashUsecaseProxy',
          useValue: hasFileHashUsecaseMock,
        },
      ],
    }).compile();

    controller = module.get<UserOrderController>(UserOrderController);
    transformAndSaveUserOrderUsecaseProxy = module.get<
      UseCaseProxy<TransformAndSaveUserOrderUsecaseProxy>
    >(UsecasesProxyModule.TRANSFORM_FILE_AND_SAVE_ORDERS_USECASE_PROXY);

    hasFileHashUsecase = module.get<UseCaseProxy<HasFileHashUsecase>>(
      UsecasesProxyModule.HAS_FILE_HASH_USECASE_PROXY,
    );
  });

  describe('getUserOrder', () => {
    it('should return an array of GetUserOrderResponseDto', async () => {
      const filterDto: GetUserOrderFilterDto = { order_id: 123 };
      const expectedResponse: GetUserOrderResponseDto[] = [
        {
          name: 'John Doe',
          orders: [],
          user_id: 1,
        },
      ];

      jest
        .spyOn(getUserOrderUsecaseMock.getInstance(), 'execute')
        .mockResolvedValue(expectedResponse);

      const result = await controller.getUserOrder(filterDto);

      expect(result).toEqual(expectedResponse);
      expect(
        getUserOrderUsecaseMock.getInstance().execute,
      ).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('saveOrdersBulky', () => {
    it('should return a SaveOrdersBulkyResponseDto', async () => {
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'orders.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 1000,
        buffer: Buffer.from(' '.repeat(95) + '\n'),
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };
      const expectedResponse: SaveOrdersBulkyResponseDto = {
        message: 'SUCCESS',
      };

      jest
        .spyOn(transformAndSaveUserOrderUsecaseProxy.getInstance(), 'execute')
        .mockResolvedValue(null);

      const result = await controller.saveOrdersBulky(file);

      expect(result).toEqual(expectedResponse);
    });
    it('should return a SaveOrdersBulkyResponseDto', async () => {
      jest.spyOn(configuration, 'getConfiguration').mockReturnValue({
        ALLOW_REPEAT_FILE_FLAG: 0,
        MAX_CHUNK_SIZE: 1000,
      } as ConfigurationType);

      jest
        .spyOn(hasFileHashUsecase.getInstance(), 'execute')
        .mockResolvedValue(true);

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'orders.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 1000,
        buffer: Buffer.from(' '.repeat(95) + '\n'),
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };

      jest
        .spyOn(transformAndSaveUserOrderUsecaseProxy.getInstance(), 'execute')
        .mockResolvedValue(null);

      const result = controller.saveOrdersBulky(file);

      await expect(result).rejects.toThrow();
    });
  });
});
