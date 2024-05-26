import { GetOrderFilter } from '../entities/input/get-order-filter';
import { UserOrder } from '../entities/user-order';
import { IUserOrderRepository } from '../interfaces/user-order-repository.interface';

export class GetUserOrderUsecase {
  constructor(private repository: IUserOrderRepository) {}
  async execute(filter: GetOrderFilter): Promise<UserOrder[]> {
    return this.repository.getUserOrder(filter);
  }
}
