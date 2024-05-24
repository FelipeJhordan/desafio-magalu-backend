import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ORDER_RESOURCE } from '../constants/order-resource.constants';

@Controller(ORDER_RESOURCE)
@ApiTags(ORDER_RESOURCE)
export class OrderController {}
