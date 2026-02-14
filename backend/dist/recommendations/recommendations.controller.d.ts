import { RecommendationsService } from './recommendations.service';
interface RequestUser {
    userId: string;
    email: string;
    role: string;
}
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    getRecommendations(user: RequestUser): Promise<{
        id: string;
        name: string;
        description: string;
        price: number;
        type: import(".prisma/client").$Enums.ProductType;
        createdAt: Date;
        categoryId: string;
    }[]>;
}
export {};
