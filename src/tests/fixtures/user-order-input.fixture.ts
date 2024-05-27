import { OrderInput } from '../../core/user-order/domain/entities/input/order-input';

export const userOrderInputFixture: OrderInput = {
  user_id: 1,
  name: 'John Doe',
  date: new Date(),
  order_id: 1,
  product_id: 1,
  value: 50,
};
