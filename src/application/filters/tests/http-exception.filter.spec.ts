import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException, Logger } from '@nestjs/common';
import { GeneralErrorFilter } from '../http-exception.filter';
import { ServiceException } from '../../../application/entities/service-exception';
import { ErrorType } from '../../../application/types/error-types.enum';

const mokGetRequest = {
  url: '/test',
};

const mockJson = jest.fn();

const mockLogger = {
  error: jest.fn(),
};

const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockGetRequest = jest.fn().mockImplementation(() => mokGetRequest);

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

beforeAll(() => {
  jest.useFakeTimers();
});

describe('Http exception filter', () => {
  let service: GeneralErrorFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneralErrorFilter,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();
    service = module.get<GeneralErrorFilter>(GeneralErrorFilter);
  });

  describe('All http exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Catch http UNKNOWN_ERROR exception', () => {
      service.catch(
        new HttpException('Http exception', HttpStatus.BAD_REQUEST),
        mockArgumentsHost,
      );

      const expectedResponse = {
        path: mokGetRequest.url,
        alias: 'UNKNOWN_ERROR',
        errors: [
          {
            field: 'error',
            messages: ['Http exception'],
          },
        ],
        message: 'Http exception',
        stackTrace: undefined,
        timestamp: new Date().toISOString(),
      };

      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(2);
      expect(mockHttpArgumentsHost).toHaveBeenCalledWith();
      expect(mockGetResponse).toHaveBeenCalledTimes(1);
      expect(mockGetResponse).toHaveBeenCalledWith();
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
    });

    it('Catch http SERVICE_ERROR exception', () => {
      service.catch(
        new ServiceException('Service exception', ErrorType.BAD_REQUEST_ERROR),
        mockArgumentsHost,
      );

      const expectedResponse = {
        path: mokGetRequest.url,
        alias: 'SERVICE_ERROR',
        errors: [
          {
            field: 'error',
            messages: ['Service exception'],
          },
        ],
        message: 'Service exception',
        stackTrace: undefined,
        timestamp: new Date().toISOString(),
      };

      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(2);
      expect(mockHttpArgumentsHost).toHaveBeenCalledWith();
      expect(mockGetResponse).toHaveBeenCalledTimes(1);
      expect(mockGetResponse).toHaveBeenCalledWith();
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
    });

    it('Catch http INVALID_PAYLOAD exception', () => {
      const badRequestException = {
        statusCode: 400,
        message: [
          'type should not be empty',
          'type must be one of these: TEST,TEST2',
          'price must be a non-empty object',
          'price must be an object',
        ],
        error: 'Bad Request',
      };

      service.catch(
        new HttpException(badRequestException, HttpStatus.BAD_REQUEST),
        mockArgumentsHost,
      );

      const expectedResponse = {
        path: mokGetRequest.url,
        alias: 'INVALID_PAYLOAD',
        errors: [
          {
            field: 'type',
            messages: [
              'should not be empty',
              'must be one of these: TEST,TEST2',
            ],
          },
          {
            field: 'price',
            messages: ['must be a non-empty object', 'must be an object'],
          },
        ],
        message: 'Bad Request',
        stackTrace: undefined,
        timestamp: new Date().toISOString(),
      };

      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(2);
      expect(mockHttpArgumentsHost).toHaveBeenCalledWith();
      expect(mockGetResponse).toHaveBeenCalledTimes(1);
      expect(mockGetResponse).toHaveBeenCalledWith();
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});
