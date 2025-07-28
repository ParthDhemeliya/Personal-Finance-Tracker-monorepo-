import * as SavingsController from '../../../src/modules/savings/savings.controller';
import SavingsGoal from '../../../models/SavingsGoal';
import { getCurrentSavings } from '../../../src/modules/savings/savings.current.service';
import * as SavingsService from '../../../src/modules/savings/savings.service';
import { savingsGoalSchema } from '../../../src/modules/savings/savings.validator';

describe('savings.controller', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { user: undefined, body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('updateSavingsGoal', () => {
    it('should return 401 if no user', async () => {
      await SavingsController.updateSavingsGoal(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 404 if goal not found', async () => {
      req.user = { _id: 'user123' };
      jest.spyOn(SavingsGoal, 'findOneAndUpdate').mockResolvedValue(null);
      await SavingsController.updateSavingsGoal(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Goal not found' });
    });
    it('should update and return goal', async () => {
      req.user = { _id: 'user123' };
      const goal = { _id: 'g1', amount: 100 };
      jest
        .spyOn(SavingsGoal, 'findOneAndUpdate')
        .mockResolvedValue(goal as any);
      await SavingsController.updateSavingsGoal(req, res, next);
      expect(SavingsGoal.findOneAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(goal);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(SavingsGoal, 'findOneAndUpdate')
        .mockRejectedValue(new Error('fail'));
      await SavingsController.updateSavingsGoal(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getCurrentSavingsController', () => {
    it('should return 401 if no user', async () => {
      await SavingsController.getCurrentSavingsController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return current savings', async () => {
      req.user = { _id: 'user123' };
      jest.spyOn(getCurrentSavings, 'bind').mockReturnValue(() => 200 as any);
      (getCurrentSavings as any).mockResolvedValue(200);
      await SavingsController.getCurrentSavingsController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ current: 200 });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      (getCurrentSavings as any).mockRejectedValue(new Error('fail'));
      await SavingsController.getCurrentSavingsController(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getSavingsGoal', () => {
    it('should return 401 if no user', async () => {
      await SavingsController.getSavingsGoal(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return goal and current', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(SavingsService, 'getSavingsGoal')
        .mockResolvedValue({ amount: 100 } as any);
      jest.spyOn(getCurrentSavings, 'bind').mockReturnValue(() => 200 as any);
      (getCurrentSavings as any).mockResolvedValue(200);
      await SavingsController.getSavingsGoal(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: 'user123',
        target: 100,
        current: 200,
      });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(SavingsService, 'getSavingsGoal')
        .mockRejectedValue(new Error('fail'));
      await SavingsController.getSavingsGoal(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('createSavingsGoal', () => {
    it('should return 401 if no user', async () => {
      await SavingsController.createSavingsGoal(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 400 if validation fails', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(savingsGoalSchema, 'safeParse')
        .mockReturnValue({ success: false, error: { errors: ['err'] } } as any);
      await SavingsController.createSavingsGoal(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: ['err'],
      });
    });
    it('should create and return goal', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(savingsGoalSchema, 'safeParse')
        .mockReturnValue({ success: true, data: { amount: 100 } } as any);
      const goal = { _id: 'g1', amount: 100 };
      jest
        .spyOn(SavingsService, 'createSavingsGoal')
        .mockResolvedValue(goal as any);
      await SavingsController.createSavingsGoal(req, res, next);
      expect(SavingsService.createSavingsGoal).toHaveBeenCalledWith({
        amount: 100,
        user: 'user123',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(goal);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(savingsGoalSchema, 'safeParse')
        .mockReturnValue({ success: true, data: { amount: 100 } } as any);
      jest
        .spyOn(SavingsService, 'createSavingsGoal')
        .mockRejectedValue(new Error('fail'));
      await SavingsController.createSavingsGoal(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
