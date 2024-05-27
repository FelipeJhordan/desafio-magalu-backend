import { UserOrderMapper } from './user-order.mapper';
import { OrderInput } from '../entities/input/order-input';
import { UserOrder } from '../entities/user-order';
import { Order } from '../entities/order';

describe('UserOrderMapper', () => {
  let mapper: UserOrderMapper;

  beforeEach(() => {
    mapper = new UserOrderMapper();
  });

  it('should map order input array to user order array', () => {
    const orderInputs: OrderInput[] = [
      {
        user_id: 1,
        name: 'John Doe',
        order_id: 1,
        product_id: 1,
        value: 50,
        date: new Date(),
      },
      {
        user_id: 1,
        name: 'John Doe',
        order_id: 1,
        product_id: 2,
        value: 30,
        date: new Date(),
      },
      {
        user_id: 1,
        name: 'John Doe',
        order_id: 2,
        product_id: 3,
        value: 70,
        date: new Date(),
      },
    ];

    const expectedUserOrders: UserOrder[] = [
      {
        user_id: 1,
        name: 'John Doe',
        orders: [
          {
            order_id: 1,
            total: 80,
            date: expect.any(Date),
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
            total: 70,
            date: expect.any(Date),
            products: [
              {
                product_id: 3,
                value: 70,
              },
            ],
          },
        ],
      },
    ];

    const mappedUserOrders = mapper.mapTo(orderInputs);

    expect(mappedUserOrders).toEqual(expectedUserOrders);
  });

  it('should group order input array by user and order', () => {
    const orderInputs: OrderInput[] = [
      {
        user_id: 1,
        name: 'John Doe',
        order_id: 1,
        product_id: 1,
        value: 50,
        date: new Date(),
      },
      {
        user_id: 1,
        name: 'John Doe',
        order_id: 1,
        product_id: 2,
        value: 30,
        date: new Date(),
      },
      {
        user_id: 1,
        name: 'John Doe',
        order_id: 2,
        product_id: 3,
        value: 70,
        date: new Date(),
      },
    ];

    const expectedGroupedData = new Map<
      number,
      { user_id: number; name: string; order: Map<number, Order> }
    >();
    expectedGroupedData.set(1, {
      user_id: 1,
      name: 'John Doe',
      order: new Map<number, Order>([
        [
          1,
          {
            order_id: 1,
            date: expect.any(Date),
            total: 80,
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
        ],
        [
          2,
          {
            order_id: 2,
            date: expect.any(Date),
            total: 70,
            products: [
              {
                product_id: 3,
                value: 70,
              },
            ],
          },
        ],
      ]),
    });

    const groupedData = mapper.groupDataByUserAndOrder(orderInputs);

    expect(groupedData).toEqual(expectedGroupedData);
  });
});
