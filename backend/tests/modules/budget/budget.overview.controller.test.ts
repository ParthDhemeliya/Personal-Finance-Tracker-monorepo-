import { getBudgetOverview } from '../../../src/modules/budget/budget.overview.controller';
import Budget from '../../../models/Budget';
import Transaction from '../../../models/Transaction';
import Category from '../../../models/Category';

describe('budget.overview.controller', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { user: undefined };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no user', async () => {
    await getBudgetOverview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return overview array', async () => {
    req.user = { _id: 'user123' };
    const budgets = [{ _id: 'b1', category: 'c1', amount: 100 }];
    const spentByCategory = [{ _id: 'c1', spent: 50 }];
    const category = { _id: 'c1', name: 'Food' };
    jest.spyOn(Budget, 'find').mockResolvedValue(budgets as any);
    jest
      .spyOn(Transaction, 'aggregate')
      .mockResolvedValue(spentByCategory as any);
    jest.spyOn(Category, 'findById').mockResolvedValue(category as any);
    await getBudgetOverview(req, res, next);
    expect(Budget.find).toHaveBeenCalledWith({ user: 'user123' });
    expect(Transaction.aggregate).toHaveBeenCalled();
    expect(Category.findById).toHaveBeenCalledWith('c1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { category: 'Food', spent: 50, budget: 100 },
    ]);
  });

  it('should call next on error', async () => {
    req.user = { _id: 'user123' };
    jest.spyOn(Budget, 'find').mockRejectedValue(new Error('fail'));
    await getBudgetOverview(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
