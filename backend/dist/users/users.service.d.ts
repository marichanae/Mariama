import { PrismaService } from '../prisma/prisma.service';
interface CreateUserParams {
    email: string;
    passwordHash: string;
    interestCategoryIds?: string[];
}
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    } | null>;
    createUser(params: CreateUserParams): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    findMe(userId: string): Promise<any>;
    updateInterests(userId: string, categoryIds: string[]): Promise<any>;
    sanitizeUser(user: any): any;
}
export {};
