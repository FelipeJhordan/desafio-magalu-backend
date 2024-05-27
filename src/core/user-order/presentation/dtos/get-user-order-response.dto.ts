import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../domain/entities/order';
import { UserOrder } from '../../domain/entities/user-order';
import { Product } from '../../domain/entities/product';

export class GetProductResponseDto extends Product {
  @ApiProperty({ type: Number, description: 'Product Id', example: 1 })
  product_id: number;
  @ApiProperty({ type: Number, description: 'Product value', example: 10.5 })
  value: number;
}

export class GetOrderResponseDto extends Order {
  @ApiProperty({ type: Date, description: 'Order date', example: '2021-09-01' })
  date: Date;
  @ApiProperty({ type: Number, description: 'Order Id', example: 1 })
  order_id: number;
  @ApiProperty({
    type: [GetProductResponseDto],
    description: 'Order Id',
    example: 1,
  })
  products: GetProductResponseDto[];
  @ApiProperty({ type: Number, description: 'Order Total', example: 5.5 })
  total?: number;
}

export class GetUserOrderResponseDto extends UserOrder {
  @ApiProperty({ type: Number, description: 'User Id', example: 2 })
  user_id: number;
  @ApiProperty({ type: String, description: 'User name', example: 'Durval' })
  name: string;
  @ApiProperty({
    type: [GetOrderResponseDto],
    description: 'User name',
    example: 'Durval',
  })
  orders: GetOrderResponseDto[];
}
