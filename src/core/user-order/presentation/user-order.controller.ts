import {
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { createInterface } from 'readline';
import {
  FILE_ALREADY_PROCESSED,
  INVALID_FILE_FORMAT,
} from 'src/application/constants/error-messages.constants';
import { Readable } from 'stream';
import { getConfiguration } from '../../../application/configuration/configuration';
import { ServiceException } from '../../../application/entities/service-exception';
import { UseCaseProxy } from '../../../application/patterns/usecase-proxy';
import { ErrorType } from '../../../application/types/error-types.enum';
import { processLinesByChunk } from '../../../application/utils/utils';
import { GenerateFileHashUseCase } from '../../../file-hash/domain/usecases/generate-file-hash.usecase';
import { HasFileHashUsecase } from '../../../file-hash/domain/usecases/has-file-hash.usecase';
import { SaveFileHashUsacase } from '../../../file-hash/domain/usecases/save-file-hash.usecase';
import { UsecasesProxyModule } from '../../../usecases-proxy/usecases-proxy.module';
import { USER_ORDER_RESOURCE } from '../constants/user-orders-resource.constants';
import { GetUserOrderUsecase } from '../domain/usecases/get-user-order.usecase';
import { TransformAndSaveUserOrderUsecaseProxy } from '../domain/usecases/transform-file-and-save-orders.usecase';
import { GetUserOrderFilterDto } from './dtos/get-user-order-filter.dto';
import { ProcessLinesWarningResponseDto } from './dtos/process-lines-warning-response.dto';
import { SaveOrdersBulkyResponseDto } from './dtos/save-orders-bulky-response.dto';

@Controller(USER_ORDER_RESOURCE)
@ApiTags(USER_ORDER_RESOURCE)
export class UserOrderController {
  constructor(
    @Inject(UsecasesProxyModule.TRANSFORM_FILE_AND_SAVE_ORDERS_USECASE_PROXY)
    private transformAndSaveUserOrderUsecaseProxy: UseCaseProxy<TransformAndSaveUserOrderUsecaseProxy>,
    @Inject(UsecasesProxyModule.GET_USER_ORDER_USECASE_PROXY)
    private getUserOrderUsecaseProxy: UseCaseProxy<GetUserOrderUsecase>,
    @Inject(UsecasesProxyModule.GENERATE_FILE_HASH_USECASE_PROXY)
    private generateFileHashUsecase: UseCaseProxy<GenerateFileHashUseCase>,
    @Inject(UsecasesProxyModule.SAVE_FILE_HASH_USECASE_PROXY)
    private saveFileHashUsecase: UseCaseProxy<SaveFileHashUsacase>,
    @Inject(UsecasesProxyModule.HAS_FILE_HASH_USECASE_PROXY)
    private hasFileHashUsecase: UseCaseProxy<HasFileHashUsecase>,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserOrder(@Query() dto: GetUserOrderFilterDto) {
    return this.getUserOrderUsecaseProxy.getInstance().execute(dto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Save orders in bulk' })
  @ApiParam({
    name: 'file',
    type: 'file',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The orders were saved successfully',
    type: SaveOrdersBulkyResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'The file is not in the correct format',
  })
  async saveOrdersBulky(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /text\/plain/ })],
        exceptionFactory: () => {
          throw new ServiceException(
            INVALID_FILE_FORMAT,
            ErrorType.UNPROCESSABLE_ENTITY,
          );
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    const { ALLOW_REPEAT_FILE_FLAG, MAX_CHUNK_SIZE } = getConfiguration();

    const fileHash = this.generateFileHashUsecase
      .getInstance()
      .execute(file.buffer);

    const alreadyProcessed = await this.hasFileHashUsecase
      .getInstance()
      .execute(fileHash);

    if (alreadyProcessed && !ALLOW_REPEAT_FILE_FLAG) {
      throw new ServiceException(
        FILE_ALREADY_PROCESSED,
        ErrorType.BAD_REQUEST_ERROR,
      );
    }

    const readableFile = Readable.from(file.buffer);

    const readlineInterface = createInterface({
      input: readableFile,
      crlfDelay: Infinity,
    });

    const linesWithError = await processLinesByChunk<
      ProcessLinesWarningResponseDto[]
    >(
      readlineInterface,
      MAX_CHUNK_SIZE,
      this.transformAndSaveUserOrderUsecaseProxy.getInstance(),
    );

    if (!alreadyProcessed) {
      this.saveFileHashUsecase.getInstance().execute(fileHash);
    }

    return new SaveOrdersBulkyResponseDto(linesWithError);
  }
}
