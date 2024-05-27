import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class GetUserOrderFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Order id', example: '693' })
  order_id?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Start date',
    example: '2021-10-15',
  })
  start_date?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'End date',
    example: '2021-11-15',
  })
  end_date?: Date;
}
