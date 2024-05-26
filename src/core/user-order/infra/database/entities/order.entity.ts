import { Prop, Schema } from '@nestjs/mongoose';
import { ProductEntity } from './product.entity';

@Schema({
  _id: false,
})
export class OrderEntity {
  @Prop()
  order_id: number;

  @Prop()
  total?: number;

  @Prop({
    type: Date,
  })
  date: Date;

  @Prop({ type: [ProductEntity] })
  products: ProductEntity[];
}
