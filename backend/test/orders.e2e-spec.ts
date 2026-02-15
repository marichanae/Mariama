import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Orders e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let productId: string;
  let email: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    const suffix = Date.now();
    email = `orders-e2e+${suffix}@example.com`;

    const uniqueName = `Commandes e2e ${suffix}`;
    const category = await prisma.category.create({
      data: { name: uniqueName },
    });

    const product = await prisma.product.create({
      data: {
        name: 'Livre hanté',
        description: 'Un grimoire qui ne devrait pas être ouvert.',
        price: 19.99,
        type: 'PHYSICAL',
        categoryId: category.id,
      },
    });

    productId = product.id;

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'secret123',
      })
      .expect(201);

    accessToken = registerRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/orders (POST) devrait créer une commande pour utilisateur authentifié', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        items: [
          {
            productId,
            quantity: 2,
          },
        ],
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0]).toHaveProperty('product');
    expect(res.body.items[0].product.id).toBe(productId);
  });

  it('/orders/me (GET) devrait retourner les commandes de l’utilisateur', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
