import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../src/products/products.service';
import { PrismaService } from '../src/prisma/prisma.service';

const mockPrisma = {
  product: {
    findMany: jest.fn(),
  },
} as any;

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('devrait filtrer par categoryId quand fourni', async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    await service.findAll({ categoryId: 'cat-1' });

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: 'cat-1' },
      orderBy: { createdAt: 'desc' },
    });
  });
});
