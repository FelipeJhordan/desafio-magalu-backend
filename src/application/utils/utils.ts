import { HttpStatus } from '@nestjs/common';
import { Interface } from 'readline';
import { ErrorType } from '../types/error-types.enum';

export const getHttpStatusCodeForErrorType = (errorCode: ErrorType): number => {
  const errors = {
    [ErrorType.BAD_REQUEST_ERROR]: HttpStatus.BAD_REQUEST,
    [ErrorType.UNPROCESSABLE_ENTITY]: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  return errors[errorCode];
};

export type Callback = {
  execute: (params: any) => any;
};

export const processLinesByChunk = async <TypeResponse>(
  lines: Interface,
  size: number,
  callback: Callback,
): Promise<TypeResponse> => {
  const LINE_SIZE = 95;
  const chunk = [];
  let index = 0;
  const linesWithError = [];

  for await (const line of lines) {
    index++;
    if (line.length !== LINE_SIZE) {
      linesWithError.push({ line, lineNumber: index });
      continue;
    }
    const order = Object.assign(
      {},
      {
        user_id: parseInt(line.substring(0, 10).trim()),
        name: line.substring(10, 55).trim(),
        order_id: parseInt(line.substring(55, 65).trim()),
        product_id: parseInt(line.substring(65, 75).trim()),
        value: parseFloat(line.substring(75, 87)),
        date: parseDate(line.substring(87, 95).trim()),
      },
    );
    chunk.push(order);

    if (chunk.length === size) {
      await callback.execute(chunk);
      chunk.splice(0, chunk.length);
    }
  }

  if (chunk.length) {
    await callback.execute(chunk);
  }

  return linesWithError as TypeResponse;
};

export const parseDate = (date: string): Date => {
  const year = parseInt(date.slice(0, 4));
  const month = parseInt(date.slice(4, 6));
  const day = parseInt(date.slice(6, 8));
  return new Date(year, month, day);
};
