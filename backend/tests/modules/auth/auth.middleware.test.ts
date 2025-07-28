import protect from '../../../src/modules/auth/auth.middleware';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { AppError } from '../../../src/utils/error/AppError';

describe('auth.middleware (protect)', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {}, cookies: {}, user: undefined };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should get token from Authorization header and attach user', async () => {
    req.headers.authorization = 'Bearer validtoken';
    const user = {
      _id: 'user123',
      select: jest.fn().mockResolvedValue('userNoPassword'),
    };
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' } as any);
    jest.spyOn(User, 'findById').mockReturnValue(user as any);
    user.select.mockResolvedValue('userNoPassword');
    await protect(req, res, next);
    expect(jwt.verify).toHaveBeenCalledWith(
      'validtoken',
      process.env.JWT_SECRET,
    );
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(user.select).toHaveBeenCalledWith('-password');
    expect(req.user).toBe('userNoPassword');
    expect(next).toHaveBeenCalledWith();
  });

  it('should get token from cookies and attach user', async () => {
    req.cookies.token = 'cookietoken';
    const user = {
      _id: 'user123',
      select: jest.fn().mockResolvedValue('userNoPassword'),
    };
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' } as any);
    jest.spyOn(User, 'findById').mockReturnValue(user as any);
    user.select.mockResolvedValue('userNoPassword');
    await protect(req, res, next);
    expect(jwt.verify).toHaveBeenCalledWith(
      'cookietoken',
      process.env.JWT_SECRET,
    );
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(user.select).toHaveBeenCalledWith('-password');
    expect(req.user).toBe('userNoPassword');
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with error if no token', async () => {
    await protect(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).message).toMatch(
      /token missing/i,
    );
  });

  it('should call next with error if jwt.verify throws', async () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('invalid');
    });
    await protect(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).message).toMatch(
      /invalid or expired token/i,
    );
  });

  it('should call next with error if user not found', async () => {
    req.headers.authorization = 'Bearer validtoken';
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' } as any);
    const user = { select: jest.fn().mockResolvedValue(null) };
    jest.spyOn(User, 'findById').mockReturnValue(user as any);
    await protect(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).message).toMatch(
      /user not found/i,
    );
  });
});
