import { HttpStatus } from '@nestjs/common';
import { createInterface } from 'readline';
import { Readable } from 'stream';

import { ErrorType } from '../types/error-types.enum';
import {
  getHttpStatusCodeForErrorType,
  parseDate,
  processLinesByChunk,
} from './utils';

jest.doMock('readline', () => {
  return {
    createInterface: jest.fn().mockImplementation(() => ({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'line') {
          callback('line1');
          callback('line2');
        }
        if (event === 'close') {
          callback();
        }
      }),
      close: jest.fn(),
    })),
  };
});
describe('utils', () => {
  describe('getHttpStatusCodeForErrorType', () => {
    it('should return 400 for ErrorType.BAD_REQUEST', () => {
      const errorCode = ErrorType.BAD_REQUEST_ERROR;
      const statusCode = getHttpStatusCodeForErrorType(errorCode);
      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 422 for ErrorType.UNPROCESSABLE_ENTITY', () => {
      const errorCode = ErrorType.UNPROCESSABLE_ENTITY;
      const statusCode = getHttpStatusCodeForErrorType(errorCode);
      expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('processLinesByChunk', () => {
    it('should process lines by chunk', async () => {
      const size = 2;
      const callback = {
        execute: jest.fn(),
      };
      const unexpectedString = 'unexpected string';

      // Crie linhas com o comprimento correto (LINE_SIZE)
      const correctLine = ' '.repeat(95);
      const linesWithError = await processLinesByChunk(
        createInterface(
          Readable.from([correctLine + unexpectedString, '\n' + correctLine]),
        ),
        size,
        callback,
      );

      expect(linesWithError).toEqual([
        {
          line: correctLine + unexpectedString,
          lineNumber: 1,
        },
      ]);
      expect(callback.execute).toHaveBeenCalledTimes(1);
    });
    it('should process lines when the chunk has sufficient length', async () => {
      const size = 2;
      const callback = {
        execute: jest.fn(),
      };

      const correctLine = ' '.repeat(95) + '\n';
      const linesWithError = await processLinesByChunk(
        createInterface(Readable.from([correctLine, correctLine])),
        size,
        callback,
      );

      expect(linesWithError).toEqual([]);
      expect(callback.execute).toHaveBeenCalledTimes(1);
    });
  });
});

describe('parseDate', () => {
  it('should parse a valid date string', () => {
    const dateString = '2022-01-01';
    const parsedDate = parseDate(dateString);
    expect(parsedDate).toBeInstanceOf(Date);
  });
});
