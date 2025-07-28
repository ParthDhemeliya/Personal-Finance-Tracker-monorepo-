import * as AuthController from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { IUserDocument } from '../../../models/User';
import { Types } from 'mongoose';
import { mockDeep } from 'jest-mock-extended';

describe('AuthController', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {}, user: undefined };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should signup and return token', async () => {
      jest
        .spyOn(AuthService, 'signup')
        .mockResolvedValue({ token: 'token123' });
      req.body = { email: 'test@example.com', password: 'pass' };
      await AuthController.signup(req, res, next);
      expect(AuthService.signup).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'token123',
        message: 'Signup successful',
      });
    });
    it('should call next on error', async () => {
      jest.spyOn(AuthService, 'signup').mockRejectedValue(new Error('fail'));
      await AuthController.signup(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    it('should login and return token', async () => {
      jest.spyOn(AuthService, 'login').mockResolvedValue({
        id: new Types.ObjectId(),
        email: 'test@example.com',
        token: 'token123',
      });
      req.body = { email: 'test@example.com', password: 'pass' };
      await AuthController.login(req, res, next);
      expect(AuthService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: expect.any(Types.ObjectId),
        email: 'test@example.com',
        token: 'token123',
        message: 'Login successful',
      });
    });
    it('should call next on error', async () => {
      jest.spyOn(AuthService, 'login').mockRejectedValue(new Error('fail'));
      await AuthController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('logout', () => {
    it('should clear cookie and return message', async () => {
      process.env.NODE_ENV = 'test';
      await AuthController.logout(req, res, next);
      expect(res.clearCookie).toHaveBeenCalledWith(
        'token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });

  describe('getUser', () => {
    it('should return 401 if no user', async () => {
      req.user = undefined;
      await AuthController.getUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return user if user exists', async () => {
      req.user = { _id: new Types.ObjectId() } as IUserDocument;
      const userMock = mockDeep<IUserDocument>();
      userMock._id = req.user._id;
      userMock.email = 'test@example.com';
      jest.spyOn(AuthService, 'getUser').mockResolvedValue(userMock as any);
      await AuthController.getUser(req, res, next);
      expect(AuthService.getUser).toHaveBeenCalledWith(req.user._id.toString());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: req.user._id,
        email: 'test@example.com',
      });
    });
    it('should call next on error', async () => {
      req.user = { _id: new Types.ObjectId() } as IUserDocument;
      jest.spyOn(AuthService, 'getUser').mockRejectedValue(new Error('fail'));
      await AuthController.getUser(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteUser', () => {
    it('should return 401 if no user', async () => {
      req.user = undefined;
      await AuthController.deleteUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should delete user and return 204', async () => {
      req.user = { _id: new Types.ObjectId() } as IUserDocument;
      jest.spyOn(AuthService, 'deleteUser').mockResolvedValue(undefined);
      await AuthController.deleteUser(req, res, next);
      expect(AuthService.deleteUser).toHaveBeenCalledWith(
        req.user._id.toString(),
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
    it('should call next on error', async () => {
      req.user = { _id: new Types.ObjectId() } as IUserDocument;
      jest
        .spyOn(AuthService, 'deleteUser')
        .mockRejectedValue(new Error('fail'));
      await AuthController.deleteUser(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
