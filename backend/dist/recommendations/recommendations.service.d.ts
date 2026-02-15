import { PrismaService } from '../prisma/prisma.service';
export declare class RecommendationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRecommendationsForUser(userId: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: number;
        type: import(".prisma/client").$Enums.ProductType;
        imageUrl: string | null;
        createdAt: Date;
        categoryId: string;
    }[]>;
}
