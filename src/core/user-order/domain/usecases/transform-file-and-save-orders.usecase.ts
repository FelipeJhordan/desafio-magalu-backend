import { IMapper } from '../../../../application/patterns/mapper.interface';
import { OrderInput } from '../entities/input/order-input';
import { UserOrder } from '../entities/user-order';
import { IUserOrderRepository } from '../interfaces/user-order-repository.interface';

export class TransformAndSaveUserOrderUsecaseProxy {
  constructor(
    private repository: IUserOrderRepository,
    private mapper: IMapper<OrderInput[], UserOrder[]>,
  ) {}

  async execute(orderInput: OrderInput[]): Promise<void> {
    const userOrders = this.mapper.mapTo(orderInput);
    return this.repository.saveOrdersBulky(userOrders);
  }
}
