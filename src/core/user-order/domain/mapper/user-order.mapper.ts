import { IMapper } from '../../../../application/patterns/mapper.interface';
import { Order } from '../entities/order';
import { UserOrder } from '../entities/user-order';
import { OrderInput } from '../entities/input/order-input';

export class UserOrderMapper implements IMapper<OrderInput[], UserOrder[]> {
  mapTo(valueToMap: OrderInput[]): UserOrder[] {
    const valueGroupedByOrder = this.groupDataByUserAndOrder(valueToMap);
    const transformedData: UserOrder[] = Array.from(
      valueGroupedByOrder.values(),
    ).map((user) => ({
      user_id: user.user_id,
      name: user.name,
      orders: Array.from(user.order.values()),
    }));

    return transformedData;
  }

  public groupDataByUserAndOrder(orderInput: OrderInput[]) {
    return orderInput.reduce((mapSet, current) => {
      const { user_id, name, order_id, product_id, value, date } = current;

      if (!mapSet.has(user_id)) {
        mapSet.set(user_id, {
          user_id: user_id,
          name: name,
          order: new Map<number, Order>(),
        });
      }

      const user = mapSet.get(user_id)!;

      if (!user.order.has(order_id)) {
        user.order.set(order_id, {
          order_id,
          date: date,
          total: 0,
          products: [],
        });
      }

      const order = user.order.get(order_id)!;

      order.products.push({
        product_id,
        value: value,
      });

      order.total += value;

      return mapSet;
    }, new Map<number, { user_id: number; name: string; order: Map<number, Order> }>());
  }
}
