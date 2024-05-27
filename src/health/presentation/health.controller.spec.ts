import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { getConnectionToken } from '@nestjs/mongoose';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';

export const mockConnection = () => ({
  readyState: 1,
});

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthCheckService,
        MongooseHealthIndicator,
        {
          provide: getConnectionToken(),
          useFactory: mockConnection,
        },
        {
          provide: HealthCheckExecutor,
          useFactory: () => ({}),
        },
        {
          provide: 'TERMINUS_ERROR_LOGGER',
          useFactory: () => ({}),
        },
        {
          provide: 'TERMINUS_LOGGER',
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);

    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('check', () => {
    it('should return the health check result', async () => {
      const expectedResult: HealthCheckResult = {
        status: 'ok',
        info: { database: { status: 'up' } },
        details: {},
      };
      const healthCheckServiceSpy = jest
        .spyOn(healthCheckService, 'check')
        .mockResolvedValue(expectedResult);

      const result = await controller.check();

      expect(result).toEqual(expectedResult);
      expect(healthCheckServiceSpy).toHaveBeenCalled();

      const callbackObject = {
        cb: await controller.mongooseCheckCallback()[0],
      };
      const callbackSpy = jest.spyOn(callbackObject, 'cb');
      await callbackObject.cb();

      expect(callbackSpy).toHaveBeenCalled();
    });
    it('should call mongo check callback', async () => {
      const callbackObject = {
        cb: await controller.mongooseCheckCallback()[0],
      };
      const callbackSpy = jest.spyOn(callbackObject, 'cb');
      await callbackObject.cb();

      expect(callbackSpy).toHaveBeenCalled();
    });
  });
});
