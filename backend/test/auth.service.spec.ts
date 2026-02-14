import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';

const mockUsersService = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  sanitizeUser: jest.fn((u) => ({ id: u.id, email: u.email, role: u.role })),
};

const mockJwtService = {
  sign: jest.fn(() => 'fake-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('devrait refuser un login avec mauvais mot de passe', async () => {
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      password: await bcrypt.hash('correct', 10),
      role: 'USER',
    } as any;

    mockUsersService.findByEmail.mockResolvedValue(user);

    await expect(
      service.login({ email: 'test@example.com', password: 'wrong' }),
    ).rejects.toBeDefined();
  });
});
