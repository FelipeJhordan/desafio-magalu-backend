import { GetOrderFilter } from '../entities/input/get-order-filter';
import { UserOrder } from '../entities/user-order';

export interface IUserOrderRepository {
  GetUserOrder(filter: GetOrderFilter): UserOrder[];
  saveOrdersBulky(orders: UserOrder[]): Promise<void>;
}
