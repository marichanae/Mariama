import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { OrdersModule } from './orders/orders.module';
import { HealthModule } from './health/health.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    AuthModule,
    UsersModule,
    ProductsModule,
    RecommendationsModule,
    OrdersModule,
    HealthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
