import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UpdateInterestsDto } from './dto/update-interests.dto';

interface RequestUser {
  userId: string;
  email: string;
  role: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: RequestUser) {
    return this.usersService.findMe(user.userId);
  }

  @Patch('interests')
  updateInterests(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateInterestsDto,
  ) {
    return this.usersService.updateInterests(user.userId, dto.categoryIds);
  }
}
