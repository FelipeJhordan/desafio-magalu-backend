import { ProcessLinesWarningResponseDto } from './process-lines-warning-response.dto';

export class SaveOrdersBulkyResponseDto {
  message: string = 'SUCCESS';
  lineErrors?: ProcessLinesWarningResponseDto[];

  constructor(lineErrors?: ProcessLinesWarningResponseDto[]) {
    if (lineErrors.length > 0) {
      this.lineErrors = lineErrors;
      this.message = 'ERROR';
    }
  }
}
