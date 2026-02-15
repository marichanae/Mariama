import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  private readonly startedAt = new Date();

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const uptimeMs = Date.now() - this.startedAt.getTime();

    let dbStatus: 'up' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    const healthy = dbStatus === 'up';

    return {
      status: healthy ? 'healthy' : 'degraded',
      uptime: `${Math.floor(uptimeMs / 1000)}s`,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus,
      },
    };
  }
}
