import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class ProductEntity {
  @Prop()
  product_id: string;

  @Prop()
  value: number;
}
