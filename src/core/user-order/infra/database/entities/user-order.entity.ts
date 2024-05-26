import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderEntity } from './order.entity';

@Schema({
  collection: 'user-order',
})
export class UserOrderEntity {
  @Prop({
    unique: true,
  })
  user_id: string;
  @Prop()
  name: string;

  @Prop({
    type: [OrderEntity],
  })
  orders: OrderEntity[];
}

export const UserOrderSchema = SchemaFactory.createForClass(UserOrderEntity);
