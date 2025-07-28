import * as BudgetController from '../../../src/modules/budget/budget.controller';
import Budget from '../../../models/Budget';
import { budgetSchema } from '../../../src/modules/budget/budget.validator';

describe('budget.controller', () => {
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

  describe('getBudgets', () => {
    it('should return 401 if no user', async () => {
      await BudgetController.getBudgets(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return budgets for user', async () => {
      req.user = { _id: 'user123' };
      const budgets = [{ _id: 'b1' }];
      jest.spyOn(Budget, 'find').mockResolvedValue(budgets as any);
      await BudgetController.getBudgets(req, res, next);
      expect(Budget.find).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(budgets);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest.spyOn(Budget, 'find').mockRejectedValue(new Error('fail'));
      await BudgetController.getBudgets(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('createBudget', () => {
    it('should return 401 if no user', async () => {
      await BudgetController.createBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 400 if validation fails', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(budgetSchema, 'safeParse')
        .mockReturnValue({ success: false, error: { errors: ['err'] } } as any);
      await BudgetController.createBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: ['err'],
      });
    });
    it('should create and return budget', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(budgetSchema, 'safeParse')
        .mockReturnValue({ success: true, data: { amount: 100 } } as any);
      const budget = { _id: 'b1', amount: 100 };
      jest.spyOn(Budget, 'create').mockResolvedValue(budget as any);
      await BudgetController.createBudget(req, res, next);
      expect(Budget.create).toHaveBeenCalledWith({
        amount: 100,
        user: 'user123',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(budget);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(budgetSchema, 'safeParse')
        .mockReturnValue({ success: true, data: { amount: 100 } } as any);
      jest.spyOn(Budget, 'create').mockRejectedValue(new Error('fail'));
      await BudgetController.createBudget(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateBudget', () => {
    it('should return 401 if no user', async () => {
      await BudgetController.updateBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 400 if validation fails', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(budgetSchema, 'partial')
        .mockReturnValue({
          safeParse: () => ({ success: false, error: { errors: ['err'] } }),
        } as any);
      await BudgetController.updateBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: ['err'],
      });
    });
    it('should return 404 if budget not found', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'b1' };
      jest
        .spyOn(budgetSchema, 'partial')
        .mockReturnValue({
          safeParse: () => ({ success: true, data: { amount: 100 } }),
        } as any);
      jest.spyOn(Budget, 'findOneAndUpdate').mockResolvedValue(null);
      await BudgetController.updateBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Budget not found.' });
    });
    it('should update and return budget', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'b1' };
      jest
        .spyOn(budgetSchema, 'partial')
        .mockReturnValue({
          safeParse: () => ({ success: true, data: { amount: 100 } }),
        } as any);
      const updated = { _id: 'b1', amount: 100 };
      jest.spyOn(Budget, 'findOneAndUpdate').mockResolvedValue(updated as any);
      await BudgetController.updateBudget(req, res, next);
      expect(Budget.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'b1', user: 'user123' },
        { amount: 100 },
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'b1' };
      jest
        .spyOn(budgetSchema, 'partial')
        .mockReturnValue({
          safeParse: () => ({ success: true, data: { amount: 100 } }),
        } as any);
      jest
        .spyOn(Budget, 'findOneAndUpdate')
        .mockRejectedValue(new Error('fail'));
      await BudgetController.updateBudget(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteBudget', () => {
    it('should return 401 if no user', async () => {
      await BudgetController.deleteBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should delete budget and return 204', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'b1' };
      jest.spyOn(Budget, 'findOneAndDelete').mockResolvedValue({} as any);
      await BudgetController.deleteBudget(req, res, next);
      expect(Budget.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'b1',
        user: 'user123',
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'b1' };
      jest
        .spyOn(Budget, 'findOneAndDelete')
        .mockRejectedValue(new Error('fail'));
      await BudgetController.deleteBudget(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
