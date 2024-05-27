import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { BulkWriteResult } from 'mongodb';

import { UserOrderRepository } from './user-order.repository';
import { GetOrderFilter } from '../../../../../core/user-order/domain/entities/input/get-order-filter';
import { UserOrderEntity } from '../entities/user-order.entity';
import { queryResponseFixture } from '../../../../../tests/fixtures/query.fixture';
import { userOrderFixture } from '../../../../../tests/fixtures/user-orders.fixture';
import { UserOrder } from '../../../../../core/user-order/domain/entities/user-order';

describe('UserOrderRepository', () => {
  let repository: UserOrderRepository;
  let userModel: Model<UserOrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOrderRepository,
        {
          provide: getModelToken(UserOrderEntity.name),
          useValue: {
            find: jest.fn().mockReturnValue(queryResponseFixture),
            create: jest.fn(),
            bulkWrite: jest.fn(),
            aggregate: jest.fn().mockReturnValue(queryResponseFixture),
          },
        },
      ],
    }).compile();

    repository = module.get<UserOrderRepository>(UserOrderRepository);
    userModel = module.get<Model<UserOrderEntity>>(
      getModelToken(UserOrderEntity.name),
    );

    jest.useFakeTimers();
  });

  describe('getUserOrder', () => {
    it('should return the user order', async () => {
      const filter: GetOrderFilter = {
        order_id: 1,
        end_date: new Date(),
      };

      jest
        .spyOn(queryResponseFixture, 'exec')
        .mockResolvedValueOnce(userOrderFixture);

      const result = await repository.getUserOrder(filter);

      expect(result).toEqual(userOrderFixture);
      expect(userModel.aggregate).toHaveBeenCalled();
    });
    it('should add the match stage to the pipeline if the order_id is provided', async () => {
      const dummyDate = new Date();
      const filter: GetOrderFilter = {
        order_id: 1,
        start_date: dummyDate,
        end_date: dummyDate,
      };

      await repository.getUserOrder(filter);

      expect(userModel.aggregate).toHaveBeenCalledWith([
        {
          $unwind: '$orders',
        },
        {
          $match: {
            'orders.order_id': filter.order_id,
            'orders.date': {
              $gte: dummyDate,
              $lte: dummyDate,
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            name: {
              $first: '$name',
            },
            orders: {
              $push: '$orders',
            },
            user_id: {
              $first: '$user_id',
            },
          },
        },
        {
          $addFields: {
            orders: {
              $map: {
                as: 'order',
                in: {
                  date: {
                    $dateToString: {
                      date: '$$order.date',
                      format: '%Y-%m-%d',
                      timezone: 'GMT',
                    },
                  },
                  order_id: '$$order.order_id',
                  products: '$$order.products',
                  total: {
                    $round: [
                      {
                        $sum: '$$order.products.value',
                      },
                      2,
                    ],
                  },
                },
                input: '$orders',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            orders: 1,
            user_id: 1,
          },
        },
      ]);
    });
  });

  describe('saveOrdersBulky', () => {
    it('should save a existing user orders in bulk', async () => {
      const dateDummy = userOrderFixture.orders[0].date;
      const userOrders: UserOrder[] = [
        {
          user_id: 1,
          name: 'John Doe',
          orders: [
            {
              order_id: 1,
              date: dateDummy,
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
              total: 100,
            },
            {
              order_id: 3,
              date: dateDummy,
              products: [
                {
                  product_id: 3,
                  value: 70,
                },
                {
                  product_id: 4,
                  value: 40,
                },
              ],
              total: 150,
            },
          ],
        },
      ];
      const bulkWriteMock = jest
        .spyOn(userModel, 'bulkWrite')
        .mockResolvedValueOnce({} as BulkWriteResult);

      jest
        .spyOn(queryResponseFixture, 'lean')
        .mockReturnValue([userOrderFixture]);

      await repository.saveOrdersBulky(userOrders);

      expect(bulkWriteMock).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: {
              user_id: 1,
            },
            update: {
              $set: {
                name: 'John Doe',
                orders: [
                  {
                    order_id: 1,
                    date: userOrderFixture.orders[0].date,
                    products: [
                      {
                        product_id: 1,
                        value: 50,
                      },
                      {
                        product_id: 2,
                        value: 30,
                      },
                      {
                        product_id: 1,
                        value: 50,
                      },
                      {
                        product_id: 2,
                        value: 30,
                      },
                    ],
                    total: 100,
                  },
                  {
                    order_id: 2,
                    date: userOrderFixture.orders[0].date,
                    products: [
                      {
                        product_id: 3,
                        value: 70,
                      },
                    ],
                    total: 150,
                  },
                  {
                    order_id: 3,
                    date: userOrderFixture.orders[0].date,
                    products: [
                      {
                        product_id: 3,
                        value: 70,
                      },
                      {
                        product_id: 4,
                        value: 40,
                      },
                    ],
                    total: 150,
                  },
                ],
              },
            },
            upsert: true,
          },
        },
      ]);
    });
    it('should save a new user orders in bulk', async () => {
      const dummyDate = new Date();
      const userOrders: UserOrder[] = [
        {
          user_id: 2,
          name: 'Fulano',
          orders: [
            {
              order_id: 12,
              date: dummyDate,
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
              total: 100,
            },
            {
              order_id: 22,
              date: dummyDate,
              products: [
                {
                  product_id: 3,
                  value: 70,
                },
                {
                  product_id: 4,
                  value: 40,
                },
              ],
              total: 150,
            },
          ],
        },
      ];
      const bulkWriteMock = jest
        .spyOn(userModel, 'bulkWrite')
        .mockResolvedValueOnce({} as BulkWriteResult);

      jest
        .spyOn(queryResponseFixture, 'lean')
        .mockReturnValue([userOrderFixture]);

      await repository.saveOrdersBulky(userOrders);

      expect(bulkWriteMock).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: {
              user_id: 2,
            },
            update: {
              $set: {
                name: 'Fulano',
                orders: [
                  {
                    order_id: 12,
                    date: dummyDate,
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
                    total: 100,
                  },
                  {
                    order_id: 22,
                    date: dummyDate,
                    products: [
                      {
                        product_id: 3,
                        value: 70,
                      },
                      {
                        product_id: 4,
                        value: 40,
                      },
                    ],
                    total: 150,
                  },
                ],
              },
            },
            upsert: true,
          },
        },
      ]);
    });
  });
});
