import { OrdersService } from './orders.service';
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
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: RequestUser, dto: CreateOrderDto): Promise<{
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
    findMine(user: RequestUser): Promise<({
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
