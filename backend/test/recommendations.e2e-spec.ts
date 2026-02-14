import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Recommendations e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    const category = await prisma.category.create({
      data: { name: 'Slasher' },
    });

    await prisma.product.create({
      data: {
        name: 'Blu-ray Massacre de la nuit',
        description: 'Un classique du slasher en haute définition.',
        price: 14.99,
        type: 'PHYSICAL',
        categoryId: category.id,
      },
    });

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'reco@example.com',
        password: 'secret123',
        interestCategoryIds: [category.id],
      })
      .expect(201);

    accessToken = registerRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/recommendations (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/recommendations')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
