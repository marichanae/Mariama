import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from '../src/orders/orders.service';
import { PrismaService } from '../src/prisma/prisma.service';

const mockPrisma = {
  product: {
    findMany: jest.fn(),
  },
  order: {
    create: jest.fn(),
  },
} as any;

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it("devrait refuser la création si la liste d'articles est vide", async () => {
    await expect(service.createForUser('user-1', [])).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('devrait refuser si un produit est introuvable', async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      { id: 'prod-1', price: 10 },
    ]);

    const items = [
      { productId: 'prod-1', quantity: 1 },
      { productId: 'prod-2', quantity: 2 },
    ];

    await expect(service.createForUser('user-1', items)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('devrait calculer le total et créer la commande', async () => {
    const items = [
      { productId: 'prod-1', quantity: 2 },
      { productId: 'prod-2', quantity: 1 },
    ];

    mockPrisma.product.findMany.mockResolvedValue([
      { id: 'prod-1', price: 10 },
      { id: 'prod-2', price: 5 },
    ]);

    const createdOrder = { id: 'order-1', total: 25, items: [] } as any;
    mockPrisma.order.create.mockResolvedValue(createdOrder);

    const result = await service.createForUser('user-1', items);

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { id: { in: ['prod-1', 'prod-2'] } },
    });

    expect(mockPrisma.order.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        total: 10 * 2 + 5 * 1,
        items: {
          create: [
            { productId: 'prod-1', quantity: 2, unitPrice: 10 },
            { productId: 'prod-2', quantity: 1, unitPrice: 5 },
          ],
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    expect(result).toBe(createdOrder);
  });
});
