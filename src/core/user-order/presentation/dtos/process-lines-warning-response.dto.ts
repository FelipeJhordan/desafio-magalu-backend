import { ApiProperty } from '@nestjs/swagger';

export class ProcessLinesWarningResponseDto {
  @ApiProperty({ type: Number, description: 'Line number', example: 1 })
  lineNumber: number;
  @ApiProperty({ type: String, description: 'Line content', example: 'line 1' })
  line: string;
}
