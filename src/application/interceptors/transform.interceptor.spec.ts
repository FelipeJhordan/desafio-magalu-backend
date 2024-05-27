import { Test, TestingModule } from '@nestjs/testing';
import { TransformInterceptor } from './transform.interceptor';
import { CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor;
  let callHandler: CallHandler<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformInterceptor],
    }).compile();

    interceptor = module.get<TransformInterceptor>(TransformInterceptor);
    callHandler = { handle: jest.fn() };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform the response using class-transformer', async () => {
    const data = { id: '1', name: 'John Doe' };
    const transformedData = { id: '1', name: 'John Doe' };

    jest.spyOn(callHandler, 'handle').mockReturnValue(of(data));

    const result = await interceptor.intercept(null, callHandler).toPromise();

    expect(result).toEqual(transformedData);
  });

  it('should pass the request to the next handler', async () => {
    const request = { body: { id: '1', name: 'John Doe' } };

    jest.spyOn(callHandler, 'handle').mockReturnValue(of(request));

    const result = await interceptor
      .intercept(request, callHandler)
      .toPromise();

    expect(result).toEqual(request);
  });
});
