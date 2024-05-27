import { UserOrder } from '../../core/user-order/domain/entities/user-order';

export const userOrderFixture: UserOrder = {
  user_id: 1,
  name: 'John Doe',
  orders: [
    {
      order_id: 1,
      total: 100,
      date: new Date(),
      products: [
        {
          product_id: 1,
          value: 50,
        },
        {
          product_id: 2,
          value: 30,
        },
      ],
    },
    {
      order_id: 2,
      total: 150,
      date: new Date(),
      products: [
        {
          product_id: 3,
          value: 70,
        },
      ],
    },
  ],
};
