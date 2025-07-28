import * as IncomeController from '../../../src/modules/income/income.controller';
import { IncomeService } from '../../../src/modules/income/income.service';
import Transaction from '../../../models/Transaction';

describe('income.controller', () => {
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

  describe('getAllIncomes', () => {
    it('should return 401 if no user', async () => {
      await IncomeController.getAllIncomes(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return incomes', async () => {
      req.user = { _id: 'user123' };
      const incomes = [{ _id: 'i1', amount: 100 }];
      jest.spyOn(IncomeService, 'getIncomes').mockResolvedValue(incomes as any);
      await IncomeController.getAllIncomes(req, res, next);
      expect(IncomeService.getIncomes).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(incomes);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(IncomeService, 'getIncomes')
        .mockRejectedValue(new Error('fail'));
      await IncomeController.getAllIncomes(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getPaginatedIncomes', () => {
    it('should return 401 if no user', async () => {
      await IncomeController.getPaginatedIncomes(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return paginated incomes', async () => {
      req.user = { _id: 'user123' };
      req.query = { page: '2', limit: '5' };
      const result = { data: [], total: 0, currentPage: 2, totalPages: 0 };
      jest
        .spyOn(IncomeService, 'getPaginatedIncomes')
        .mockResolvedValue(result as any);
      await IncomeController.getPaginatedIncomes(req, res, next);
      expect(IncomeService.getPaginatedIncomes).toHaveBeenCalledWith(
        'user123',
        2,
        5,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.query = { page: '2', limit: '5' };
      jest
        .spyOn(IncomeService, 'getPaginatedIncomes')
        .mockRejectedValue(new Error('fail'));
      await IncomeController.getPaginatedIncomes(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('createIncome', () => {
    it('should return 401 if no user', async () => {
      await IncomeController.createIncome(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should create and return income', async () => {
      req.user = { _id: 'user123' };
      req.body = { amount: 100 };
      const income = { _id: 'i1', amount: 100 };
      jest
        .spyOn(IncomeService, 'createIncome')
        .mockResolvedValue(income as any);
      await IncomeController.createIncome(req, res, next);
      expect(IncomeService.createIncome).toHaveBeenCalledWith({
        ...req.body,
        user: 'user123',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(income);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.body = { amount: 100 };
      jest
        .spyOn(IncomeService, 'createIncome')
        .mockRejectedValue(new Error('fail'));
      await IncomeController.createIncome(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateIncome', () => {
    it('should return 401 if no user', async () => {
      await IncomeController.updateIncome(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 404 if not found', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'i1' };
      jest.spyOn(IncomeService, 'updateIncome').mockResolvedValue(null);
      await IncomeController.updateIncome(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Income not found.' });
    });
    it('should update and return income', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'i1' };
      const updated = { _id: 'i1', amount: 200 };
      jest
        .spyOn(IncomeService, 'updateIncome')
        .mockResolvedValue(updated as any);
      await IncomeController.updateIncome(req, res, next);
      expect(IncomeService.updateIncome).toHaveBeenCalledWith(
        'i1',
        'user123',
        req.body,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'i1' };
      jest
        .spyOn(IncomeService, 'updateIncome')
        .mockRejectedValue(new Error('fail'));
      await IncomeController.updateIncome(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteIncome', () => {
    it('should return 401 if no user', async () => {
      await IncomeController.deleteIncome(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return 404 if not found', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'i1' };
      jest.spyOn(IncomeService, 'deleteIncome').mockResolvedValue(null);
      await IncomeController.deleteIncome(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Income not found.' });
    });
    it('should delete and return success', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'i1' };
      jest.spyOn(IncomeService, 'deleteIncome').mockResolvedValue(true as any);
      await IncomeController.deleteIncome(req, res, next);
      expect(IncomeService.deleteIncome).toHaveBeenCalledWith('i1', 'user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Income deleted successfully',
      });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'i1' };
      jest
        .spyOn(IncomeService, 'deleteIncome')
        .mockRejectedValue(new Error('fail'));
      await IncomeController.deleteIncome(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getTotalIncome', () => {
    it('should return 401 if no user', async () => {
      await IncomeController.getTotalIncome(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should return total income', async () => {
      req.user = { _id: 'user123' };
      jest
        .spyOn(Transaction, 'aggregate')
        .mockResolvedValue([{ total: '123.45' }] as any);
      await IncomeController.getTotalIncome(req, res, next);
      expect(Transaction.aggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ total: 123 });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest.spyOn(Transaction, 'aggregate').mockRejectedValue(new Error('fail'));
      await IncomeController.getTotalIncome(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
