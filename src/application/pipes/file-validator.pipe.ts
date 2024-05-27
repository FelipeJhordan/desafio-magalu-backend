import { FileTypeValidator, ParseFilePipe } from '@nestjs/common';
import { ServiceException } from '../entities/service-exception';
import { INVALID_FILE_FORMAT } from '../constants/error-messages.constants';
import { ErrorType } from '../types/error-types.enum';

export const invalidExtensionPipe = () =>
  new ParseFilePipe({
    validators: [new FileTypeValidator({ fileType: /text\/plain/ })],
    exceptionFactory: () => {
      throw new ServiceException(
        INVALID_FILE_FORMAT,
        ErrorType.UNPROCESSABLE_ENTITY,
      );
    },
  });
