import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateUserParams {
  email: string;
  passwordHash: string;
  interestCategoryIds?: string[];
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(params: CreateUserParams) {
    const { email, passwordHash, interestCategoryIds } = params;

    return this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        interests: interestCategoryIds
          ? {
              connect: interestCategoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { interests: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.sanitizeUser(user);
  }

  async updateInterests(userId: string, categoryIds: string[]) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        interests: {
          set: categoryIds.map((id) => ({ id })),
        },
      },
      include: { interests: true },
    });

    return this.sanitizeUser(user);
  }

  sanitizeUser(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
