import { PrismaService } from '../prisma/prisma.service';
interface CreateOrderItemInput {
    productId: string;
    quantity: number;
}
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createForUser(userId: string, items: CreateOrderItemInput[]): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                description: string;
                price: number;
                type: import(".prisma/client").$Enums.ProductType;
                imageUrl: string | null;
                createdAt: Date;
                categoryId: string;
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: number;
        })[];
    } & {
        id: string;
        userId: string;
        total: number;
        status: string;
        createdAt: Date;
    }>;
    findMine(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                description: string;
                price: number;
                type: import(".prisma/client").$Enums.ProductType;
                imageUrl: string | null;
                createdAt: Date;
                categoryId: string;
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: number;
        })[];
    } & {
        id: string;
        userId: string;
        total: number;
        status: string;
        createdAt: Date;
    })[]>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string;
                price: number;
                type: import(".prisma/client").$Enums.ProductType;
                imageUrl: string | null;
                createdAt: Date;
                categoryId: string;
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: number;
        })[];
    } & {
        id: string;
        userId: string;
        total: number;
        status: string;
        createdAt: Date;
    })[]>;
}
export {};
