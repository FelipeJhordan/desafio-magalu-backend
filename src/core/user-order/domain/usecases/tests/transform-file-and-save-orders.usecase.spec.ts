import { IMapper } from '../../../../../application/patterns/mapper.interface';
import { OrderInput } from '../../entities/input/order-input';
import { UserOrder } from '../../entities/user-order';
import { IUserOrderRepository } from '../../interfaces/user-order-repository.interface';
import { TransformAndSaveUserOrderUsecaseProxy } from '../transform-file-and-save-orders.usecase';
import { userOrderFixture } from '../../../../../tests/fixtures/user-orders.fixture';
import { userOrderInputFixture } from '../../../../../tests/fixtures/user-order-input.fixture';

describe('TransformAndSaveUserOrderUsecaseProxy', () => {
  let repository: IUserOrderRepository;
  let mapper: IMapper<OrderInput[], UserOrder[]>;
  let usecase: TransformAndSaveUserOrderUsecaseProxy;

  beforeEach(() => {
    repository = {
      saveOrdersBulky: jest.fn(),
      getUserOrder: jest.fn(),
    };
    mapper = {
      mapTo: jest.fn(),
    };
    usecase = new TransformAndSaveUserOrderUsecaseProxy(repository, mapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save user orders using the repository', async () => {
    const orderInput: OrderInput[] = [userOrderInputFixture];

    (mapper.mapTo as jest.Mock).mockReturnValue([userOrderFixture]);

    await usecase.execute(orderInput);

    expect(mapper.mapTo).toHaveBeenCalledWith(orderInput);
    expect(repository.saveOrdersBulky).toHaveBeenCalledWith([userOrderFixture]);
  });

  it('should return void', async () => {
    const orderInput: OrderInput[] = [userOrderInputFixture];

    (mapper.mapTo as jest.Mock).mockReturnValue([userOrderFixture]);

    const result = await usecase.execute(orderInput);

    expect(result).toBeUndefined();
  });
});
