import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from '../src/recommendations/recommendations.service';
import { PrismaService } from '../src/prisma/prisma.service';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
  },
} as any;

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
    jest.clearAllMocks();
  });

  it('retourne un tableau vide si aucun intérêt', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ interests: [] });

    const res = await service.getRecommendationsForUser('user-1');

    expect(res).toEqual([]);
  });
});
