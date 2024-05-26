import { Product } from './product';

export class Order {
  order_id: number;
  total?: number;
  date: Date;
  products: Product[];
}
