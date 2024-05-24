import { IMapper } from 'src/application/patterns/mapper';
import { Order } from '../entities/order';
import { OrderInput, UserOrder } from '../entities/user-order';

export class UserOrderMapper implements IMapper<OrderInput[], UserOrder[]> {
  mapTo(valueToMap: OrderInput[]): UserOrder[] {
    const valueGroupedByOrder = this.groupDataByUserAndOrder(valueToMap);
    const transformedData: UserOrder[] = Array.from(
      valueGroupedByOrder.values(),
    ).map((user) => ({
      userId: user.userId,
      name: user.name,
      orders: Array.from(user.order.values()),
    }));

    return transformedData;
  }

  public groupDataByUserAndOrder(orderInput: OrderInput[]) {
    return orderInput.reduce((mapSet, current) => {
      const { userId, name, orderId, productId, value, date } = current;

      if (!mapSet.has(userId)) {
        mapSet.set(userId, {
          userId: userId,
          name: name,
          order: new Map<number, Order>(),
        });
      }

      const user = mapSet.get(userId)!;

      if (!user.order.has(orderId)) {
        user.order.set(orderId, {
          orderId,
          date: date,
          total: 0,
          products: [],
        });
      }

      const order = user.order.get(orderId)!;

      order.products.push({
        productId,
        value: value,
      });

      order.total += value;

      return mapSet;
    }, new Map<number, { userId: number; name: string; order: Map<number, Order> }>());
  }
}
