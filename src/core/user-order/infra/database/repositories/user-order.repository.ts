import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetOrderFilter } from '../../../../../core/user-order/domain/entities/input/get-order-filter';
import { UserOrder } from '../../../../../core/user-order/domain/entities/user-order';
import { IUserOrderRepository } from '../../../../../core/user-order/domain/interfaces/user-order-repository.interface';
import { UserOrderEntity } from '../entities/user-order.entity';

export class UserOrderRepository implements IUserOrderRepository {
  constructor(
    @InjectModel(UserOrderEntity.name)
    private userOrderModel: Model<UserOrder>,
  ) {}

  async getUserOrder(filter: GetOrderFilter): Promise<UserOrder[]> {
    const match: any = {};
    if (filter.order_id) {
      match['orders.order_id'] = filter.order_id;
    }

    if (filter.start_date) {
      match['orders.date'] = { $gte: filter.start_date };
    }

    if (filter.end_date) {
      if (!match['orders.date']) {
        match['orders.date'] = {};
      }
      match['orders.date'].$lte = filter.end_date;
    }

    const pipeline: any[] = [
      { $unwind: '$orders' },
      { $match: match },
      {
        $group: {
          _id: '$_id',
          user_id: { $first: '$user_id' },
          name: { $first: '$name' },
          orders: { $push: '$orders' },
        },
      },
      {
        $addFields: {
          orders: {
            $map: {
              input: '$orders',
              as: 'order',
              in: {
                order_id: '$$order.order_id',
                total: { $round: [{ $sum: '$$order.products.value' }, 2] },
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$$order.date',
                    timezone: 'GMT',
                  },
                },
                products: '$$order.products',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: 1,
          name: 1,
          orders: 1,
        },
      },
    ];

    const userOrders = await this.userOrderModel.aggregate(pipeline).exec();
    return userOrders;
  }

  async saveOrdersBulky(userOrders: UserOrder[]): Promise<void> {
    const existingUserOrdersMap = await this.getExistingUserOrders(userOrders);
    const bulkOperations = this.prepareBulkOperations(
      userOrders,
      existingUserOrdersMap,
    );

    if (bulkOperations.length > 0) {
      await this.userOrderModel.bulkWrite(bulkOperations);
    }
  }

  async getExistingUserOrders(
    userOrders: UserOrder[],
  ): Promise<Record<string, any>> {
    const userIds = userOrders.map((userOrder) => userOrder.user_id);
    const existingUserOrders = await this.userOrderModel
      .find({ user_id: { $in: userIds } })
      .lean();

    return existingUserOrders.reduce((map, userOrder) => {
      map[userOrder.user_id] = userOrder;
      return map;
    }, {});
  }

  prepareBulkOperations(
    userOrders: UserOrder[],
    existingUserOrdersMap: Record<string, any>,
  ): any[] {
    const bulkOperations = [];

    for (const userOrder of userOrders) {
      const existingUserOrder = existingUserOrdersMap[userOrder.user_id];

      if (existingUserOrder) {
        this.updateExistingUserOrder(
          userOrder,
          existingUserOrder,
          bulkOperations,
        );
        continue;
      }

      bulkOperations.push(this.prepareNewUserOrderOperation(userOrder));
    }

    return bulkOperations;
  }

  updateExistingUserOrder(
    userOrder: UserOrder,
    existingUserOrder: any,
    bulkOperations: any[],
  ): void {
    for (const newOrder of userOrder.orders) {
      const existingOrder = existingUserOrder.orders.find(
        (o) => o.order_id === newOrder.order_id,
      );

      if (existingOrder) {
        existingOrder.products = [
          ...existingOrder.products,
          ...newOrder.products,
        ];
        continue;
      }

      existingUserOrder.orders.push(newOrder);
    }

    bulkOperations.push(
      this.prepareExistingUserOrderOperation(userOrder, existingUserOrder),
    );
  }

  prepareExistingUserOrderOperation(
    userOrder: UserOrder,
    existingUserOrder: any,
  ): any {
    return {
      updateOne: {
        filter: { user_id: userOrder.user_id },
        update: {
          $set: {
            name: userOrder.name,
            orders: existingUserOrder.orders,
          },
        },
        upsert: true,
      },
    };
  }

  prepareNewUserOrderOperation(userOrder: UserOrder): any {
    return {
      updateOne: {
        filter: { user_id: userOrder.user_id },
        update: {
          $set: {
            name: userOrder.name,
            orders: userOrder.orders,
          },
        },
        upsert: true,
      },
    };
  }
}
