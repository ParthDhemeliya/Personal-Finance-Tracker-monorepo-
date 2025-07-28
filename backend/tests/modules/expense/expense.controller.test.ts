import * as ExpenseController from '../../../src/modules/expense/expense.controller';
import { ExpenseRepository } from '../../../src/modules/expense/expense.repository';
import { ExpenseService } from '../../../src/modules/expense/expense.service';

describe('expense.controller', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { user: undefined, body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getCategorySummary', () => {
    it('should return 401 if no user', async () => {
      await ExpenseController.getCategorySummary(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 400 if month is missing', async () => {
      req.user = { _id: 'user123' };
      await ExpenseController.getCategorySummary(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringMatching(/month/i),
      });
    });
    it('should return summary if valid', async () => {
      req.user = { _id: 'user123' };
      req.query = { month: '2023-01' };
      const summary = [{ category: 'Food', amount: 100 }];
      jest
        .spyOn(ExpenseRepository, 'getCategorySummaryByMonth')
        .mockResolvedValue(summary as any);
      await ExpenseController.getCategorySummary(req, res, next);
      expect(ExpenseRepository.getCategorySummaryByMonth).toHaveBeenCalledWith(
        'user123',
        '2023-01',
      );
      expect(res.json).toHaveBeenCalledWith(summary);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.query = { month: '2023-01' };
      jest
        .spyOn(ExpenseRepository, 'getCategorySummaryByMonth')
        .mockRejectedValue(new Error('fail'));
      await ExpenseController.getCategorySummary(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('createExpense', () => {
    it('should return 401 if no user', async () => {
      await ExpenseController.createExpense(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should create and return expense', async () => {
      req.user = { _id: 'user123' };
      req.body = { amount: 100 };
      const result = { _id: 'e1', amount: 100 };
      jest
        .spyOn(ExpenseService, 'createExpense')
        .mockResolvedValue(result as any);
      await ExpenseController.createExpense(req, res, next);
      expect(ExpenseService.createExpense).toHaveBeenCalledWith(
        req.body,
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(result);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.body = { amount: 100 };
      jest
        .spyOn(ExpenseService, 'createExpense')
        .mockRejectedValue(new Error('fail'));
      await ExpenseController.createExpense(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllExpenses', () => {
    it('should return 401 if no user', async () => {
      await ExpenseController.getAllExpenses(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return all expenses', async () => {
      req.user = { _id: 'user123' };
      const result = [{ _id: 'e1', amount: 100 }];
      jest
        .spyOn(ExpenseService, 'getAllExpenses')
        .mockResolvedValue(result as any);
      await ExpenseController.getAllExpenses(req, res, next);
      expect(ExpenseService.getAllExpenses).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith(result);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(ExpenseService, 'getAllExpenses')
        .mockRejectedValue(new Error('fail'));
      await ExpenseController.getAllExpenses(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateExpense', () => {
    it('should return 401 if no user', async () => {
      await ExpenseController.updateExpense(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should update and return expense', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'e1' };
      req.body = { amount: 200 };
      const result = { _id: 'e1', amount: 200 };
      jest
        .spyOn(ExpenseService, 'updateExpense')
        .mockResolvedValue(result as any);
      await ExpenseController.updateExpense(req, res, next);
      expect(ExpenseService.updateExpense).toHaveBeenCalledWith(
        'e1',
        req.body,
        'user123',
      );
      expect(res.json).toHaveBeenCalledWith(result);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'e1' };
      req.body = { amount: 200 };
      jest
        .spyOn(ExpenseService, 'updateExpense')
        .mockRejectedValue(new Error('fail'));
      await ExpenseController.updateExpense(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteExpense', () => {
    it('should return 401 if no user', async () => {
      await ExpenseController.deleteExpense(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should delete expense and return 204', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'e1' };
      jest.spyOn(ExpenseService, 'deleteExpense').mockResolvedValue({} as any);
      await ExpenseController.deleteExpense(req, res, next);
      expect(ExpenseService.deleteExpense).toHaveBeenCalledWith(
        'e1',
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'e1' };
      jest
        .spyOn(ExpenseService, 'deleteExpense')
        .mockRejectedValue(new Error('fail'));
      await ExpenseController.deleteExpense(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getPaginatedExpenses', () => {
    it('should return 401 if no user', async () => {
      await ExpenseController.getPaginatedExpenses(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return paginated expenses', async () => {
      req.user = { _id: 'user123' };
      req.query = { page: '2', limit: '5' };
      const result = { data: [], total: 0, currentPage: 2, totalPages: 0 };
      jest
        .spyOn(ExpenseService, 'getPaginatedExpenses')
        .mockResolvedValue(result as any);
      await ExpenseController.getPaginatedExpenses(req, res, next);
      expect(ExpenseService.getPaginatedExpenses).toHaveBeenCalledWith(
        2,
        5,
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.query = { page: '2', limit: '5' };
      jest
        .spyOn(ExpenseService, 'getPaginatedExpenses')
        .mockRejectedValue(new Error('fail'));
      await ExpenseController.getPaginatedExpenses(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getTotalExpense', () => {
    it('should return 401 if no user', async () => {
      await ExpenseController.getTotalExpense(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return total expense', async () => {
      req.user = { _id: 'user123' };
      const total = { total: 123 };
      jest
        .spyOn(ExpenseService, 'calculateTotalAmount')
        .mockResolvedValue(total as any);
      await ExpenseController.getTotalExpense(req, res, next);
      expect(ExpenseService.calculateTotalAmount).toHaveBeenCalledWith(
        'user123',
      );
      expect(res.json).toHaveBeenCalledWith(total);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(ExpenseService, 'calculateTotalAmount')
        .mockRejectedValue(new Error('fail'));
      await ExpenseController.getTotalExpense(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
