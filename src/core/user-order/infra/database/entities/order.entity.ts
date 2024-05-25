import { Prop, Schema } from '@nestjs/mongoose';
import { ProductEntity } from './product.entity';

@Schema()
export class OrderEntity {
  @Prop()
  orderId: number;

  @Prop()
  total?: number;

  @Prop()
  date: Date;

  @Prop({ type: [ProductEntity] })
  products: ProductEntity[];
}
