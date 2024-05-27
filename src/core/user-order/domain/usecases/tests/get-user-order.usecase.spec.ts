import { userOrderFixture } from '../../../../../tests/fixtures/user-orders.fixture';
import { GetUserOrderUsecase } from '../get-user-order.usecase';
import { IUserOrderRepository } from '../../interfaces/user-order-repository.interface';
import { GetOrderFilter } from '../../entities/input/get-order-filter';
import { UserOrder } from '../../entities/user-order';

describe('GetUserOrderUsecase', () => {
  let usecase: GetUserOrderUsecase;
  let repository: IUserOrderRepository;

  beforeEach(() => {
    repository = {
      getUserOrder: jest.fn(),
      saveOrdersBulky: jest.fn(),
    };
    usecase = new GetUserOrderUsecase(repository);
  });

  it('should return user orders from the repository', async () => {
    const filter: GetOrderFilter = {
      order_id: 1,
    };

    (repository.getUserOrder as jest.Mock).mockResolvedValue([
      userOrderFixture,
    ]);

    const userOrders = await usecase.execute(filter);

    expect(repository.getUserOrder).toHaveBeenCalledWith(filter);
    expect(userOrders).toEqual([userOrderFixture]);
  });

  it('should return an empty array if no user orders are found', async () => {
    const filter: GetOrderFilter = {
      order_id: 2,
    };
    const expectedUserOrders: UserOrder[] = [];

    (repository.getUserOrder as jest.Mock).mockResolvedValue(
      expectedUserOrders,
    );

    const userOrders = await usecase.execute(filter);

    expect(repository.getUserOrder).toHaveBeenCalledWith(filter);
    expect(userOrders).toEqual(expectedUserOrders);
  });
});
