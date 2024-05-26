import { GetOrderFilter } from '../entities/input/get-order-filter';
import { UserOrder } from '../entities/user-order';

export interface IUserOrderRepository {
  getUserOrder(filter: GetOrderFilter): Promise<UserOrder[]>;
  saveOrdersBulky(orders: UserOrder[]): Promise<void>;
}
