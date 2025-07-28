import * as BudgetManagement from '../../../src/modules/budget/budget.management.controller';

describe('budget.management.controller', () => {
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

  describe('createBudget', () => {
    it('should return 401 if no user', async () => {
      await BudgetManagement.createBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should create and return budget', async () => {
      req.user = { _id: 'user123' };
      req.body = { amount: 100 };
      await BudgetManagement.createBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ...req.body,
        user: 'user123',
        _id: 'mock',
      });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      jest.spyOn(res, 'json').mockImplementation(() => {
        throw new Error('fail');
      });
      await BudgetManagement.createBudget(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateBudget', () => {
    it('should return 401 if no user', async () => {
      await BudgetManagement.updateBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should update and return budget', async () => {
      req.user = { _id: 'user123' };
      req.body = { amount: 200 };
      req.params = { id: 'b1' };
      await BudgetManagement.updateBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...req.body,
        user: 'user123',
        _id: 'b1',
      });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.body = { amount: 200 };
      req.params = { id: 'b1' };
      jest.spyOn(res, 'json').mockImplementation(() => {
        throw new Error('fail');
      });
      await BudgetManagement.updateBudget(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteBudget', () => {
    it('should return 401 if no user', async () => {
      await BudgetManagement.deleteBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    it('should delete budget and return success', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'b1' };
      await BudgetManagement.deleteBudget(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Budget deleted successfully',
      });
    });
    it('should call next on error', async () => {
      req.user = { _id: 'user123' };
      req.params = { id: 'b1' };
      jest.spyOn(res, 'json').mockImplementation(() => {
        throw new Error('fail');
      });
      await BudgetManagement.deleteBudget(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
