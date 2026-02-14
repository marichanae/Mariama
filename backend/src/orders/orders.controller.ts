import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestUser {
  userId: string;
  email: string;
  role: string;
}

interface CreateOrderDto {
  items: {
    productId: string;
    quantity: number;
  }[];
}

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.createForUser(user.userId, dto.items);
  }

  @Get('me')
  findMine(@CurrentUser() user: RequestUser) {
    return this.ordersService.findMine(user.userId);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.ordersService.findAll();
  }
}
