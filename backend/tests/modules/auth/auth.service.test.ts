import { AuthService } from '../../../src/modules/auth/auth.service';
import { AuthRepository } from '../../../src/modules/auth/auth.repository';
import { AppError } from '../../../src/utils/error/AppError';
import * as jwt from 'jsonwebtoken';
import { mockDeep } from 'jest-mock-extended';
import type { IUserDocument } from '../../../models/User';

describe('AuthService', () => {
  const baseUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedpassword',
    first_name: 'Test',
    last_name: 'User',
    is_active: true,
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return a token', async () => {
      jest.spyOn(AuthRepository, 'findByEmail').mockResolvedValue(null);
      const userMock = mockDeep<IUserDocument>();
      Object.assign(userMock, baseUser);
      jest
        .spyOn(AuthRepository, 'createUser')
        .mockResolvedValue(userMock as any);
      jest.spyOn(AuthService, 'generateToken').mockReturnValue('token123');

      const data = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
      };
      const result = await AuthService.signup(data as any);
      expect(result.token).toBe('token123');
      expect(AuthRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(AuthRepository.createUser).toHaveBeenCalledWith(data);
    });

    it('should throw if user already exists', async () => {
      const userMock = mockDeep<IUserDocument>();
      Object.assign(userMock, baseUser);
      jest
        .spyOn(AuthRepository, 'findByEmail')
        .mockResolvedValue(userMock as any);
      await expect(
        AuthService.signup({ email: 'test@example.com' } as any),
      ).rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const userMock = mockDeep<IUserDocument>();
      Object.assign(userMock, baseUser);
      userMock.matchPassword.mockResolvedValue(true);
      jest
        .spyOn(AuthRepository, 'findByEmail')
        .mockResolvedValue(userMock as any);
      jest.spyOn(AuthService, 'generateToken').mockReturnValue('token123');
      const data = { email: 'test@example.com', password: 'password123' };
      const result = await AuthService.login(data as any);
      expect(result.token).toBe('token123');
      expect(result.email).toBe('test@example.com');
    });
    it('should throw if user not found', async () => {
      jest.spyOn(AuthRepository, 'findByEmail').mockResolvedValue(null);
      await expect(
        AuthService.login({
          email: 'notfound@example.com',
          password: 'pass',
        } as any),
      ).rejects.toThrow(AppError);
    });
    it('should throw if password does not match', async () => {
      const userMock = mockDeep<IUserDocument>();
      Object.assign(userMock, baseUser);
      userMock.matchPassword.mockResolvedValue(false);
      jest
        .spyOn(AuthRepository, 'findByEmail')
        .mockResolvedValue(userMock as any);
      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'wrong',
        } as any),
      ).rejects.toThrow(AppError);
    });
  });

  describe('getUser', () => {
    it('should return user if found', async () => {
      const userMock = mockDeep<IUserDocument>();
      Object.assign(userMock, baseUser);
      jest.spyOn(AuthRepository, 'findById').mockResolvedValue(userMock as any);
      const result = await AuthService.getUser('user123');
      expect(result).toEqual(userMock);
    });
    it('should throw if user not found', async () => {
      jest.spyOn(AuthRepository, 'findById').mockResolvedValue(null);
      await expect(AuthService.getUser('notfound')).rejects.toThrow(AppError);
    });
  });

  describe('deleteUser', () => {
    it('should not throw if user deleted', async () => {
      const userMock = mockDeep<IUserDocument>();
      Object.assign(userMock, baseUser);
      jest
        .spyOn(AuthRepository, 'deleteUser')
        .mockResolvedValue(userMock as any);
      await expect(AuthService.deleteUser('user123')).resolves.toBeUndefined();
    });
    it('should throw if user not found', async () => {
      jest.spyOn(AuthRepository, 'deleteUser').mockResolvedValue(null);
      await expect(AuthService.deleteUser('notfound')).rejects.toThrow(
        AppError,
      );
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('signedtoken' as any);
      process.env.JWT_SECRET = 'secret';
      const token = AuthService.generateToken('user123');
      expect(token).toBe('signedtoken');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'user123' }, 'secret', {
        expiresIn: '7d',
      });
    });
  });
});
