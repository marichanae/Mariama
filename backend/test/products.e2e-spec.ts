import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Products e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    const uniqueName = `Horreur Classique ${Date.now()}`;
    const category = await prisma.category.create({
      data: { name: uniqueName },
    });

    await prisma.product.create({
      data: {
        name: 'Figurine Dracula',
        description: 'Une figurine détaillée du comte Dracula.',
        price: 29.99,
        type: 'PHYSICAL',
        categoryId: category.id,
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
