import { Module } from '@nestjs/common';
import { OrderController } from './presentation/order.controller';

@Module({
  controllers: [OrderController],
})
export class OrderModule {}
