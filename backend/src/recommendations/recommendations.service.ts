import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecommendationsForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { interests: true },
    });

    if (!user || user.interests.length === 0) {
      // Pas d’intérêts => pas de recommandations pour le moment
      return [];
    }

    const categoryIds = user.interests.map((c) => c.id);

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return products;
  }
}
