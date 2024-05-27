import { ApiProperty } from '@nestjs/swagger';
import { ProcessLinesWarningResponseDto } from './process-lines-warning-response.dto';

export class SaveOrdersBulkyResponseDto {
  @ApiProperty({ type: String, description: 'Message', example: 'SUCCESS' })
  message: string = 'SUCCESS';
  @ApiProperty({
    type: [ProcessLinesWarningResponseDto],
    description: 'List of lines with errors',
    example: [{ lineNumber: 1, line: 'line 1' }],
  })
  lineErrors?: ProcessLinesWarningResponseDto[];

  constructor(lineErrors?: ProcessLinesWarningResponseDto[]) {
    if (lineErrors.length > 0) {
      this.lineErrors = lineErrors;
      this.message = 'ERROR';
    }
  }
}
