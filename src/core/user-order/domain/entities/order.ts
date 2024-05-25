import { Product } from './product';

export class Order {
  orderId: number;
  total?: number;
  date: Date;
  products: Product[];
}
