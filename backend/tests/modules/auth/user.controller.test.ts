import * as UserController from '../../../src/modules/auth/user.controller';
import User from '../../../models/User';

describe('user.controller', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {}, user: undefined };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('updateUserProfile', () => {
    it('should return 401 if no user', async () => {
      req.user = undefined;
      await UserController.updateUserProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 404 if user not found', async () => {
      req.user = { _id: { toString: () => 'user123' } };
      req.body = { first_name: 'A', last_name: 'B' };
      jest
        .spyOn(User, 'findByIdAndUpdate')
        .mockReturnValue({ select: jest.fn().mockResolvedValue(null) } as any);
      await UserController.updateUserProfile(req, res, next);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({ first_name: 'A', last_name: 'B' }),
        expect.objectContaining({ new: true, runValidators: true }),
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });
    it('should update and return user if found', async () => {
      req.user = { _id: { toString: () => 'user123' } };
      req.body = { first_name: 'A', last_name: 'B' };
      const updatedUser = { _id: 'user123', first_name: 'A', last_name: 'B' };
      jest
        .spyOn(User, 'findByIdAndUpdate')
        .mockReturnValue({
          select: jest.fn().mockResolvedValue(updatedUser),
        } as any);
      await UserController.updateUserProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
    it('should call next on error', async () => {
      req.user = { _id: { toString: () => 'user123' } };
      req.body = { first_name: 'A', last_name: 'B' };
      jest.spyOn(User, 'findByIdAndUpdate').mockImplementation(() => {
        throw new Error('fail');
      });
      await UserController.updateUserProfile(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
