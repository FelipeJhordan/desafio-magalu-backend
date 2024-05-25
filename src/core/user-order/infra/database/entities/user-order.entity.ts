import { Prop, Schema } from '@nestjs/mongoose';
import { OrderEntity } from './order.entity';

@Schema({
  collection: 'user-order',
})
export class UserOrderEntity {
  @Prop({
    unique: true,
  })
  userId: string;
  @Prop()
  name: string;

  @Prop({
    type: [OrderEntity],
  })
  orders: OrderEntity[];
}
