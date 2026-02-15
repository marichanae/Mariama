import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    private readonly startedAt;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        uptime: string;
        timestamp: string;
        checks: {
            database: "up" | "down";
        };
    }>;
}
