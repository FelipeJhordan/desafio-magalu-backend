import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class GetUserOrderFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  order_id?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_date?: Date;
}
