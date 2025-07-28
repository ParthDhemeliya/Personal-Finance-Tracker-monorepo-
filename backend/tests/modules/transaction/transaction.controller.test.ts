import * as TransactionController from '../../../src/modules/transaction/transaction.controller';
import * as TransactionService from '../../../src/modules/transaction/transaction.service';

describe('transaction.controller', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { user: undefined, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no user', async () => {
    await TransactionController.getRecentTransactions(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
  it('should return recent transactions', async () => {
    req.user = { _id: 'user123' };
    req.query = { limit: '3' };
    const transactions = [{ _id: 't1', amount: 100 }];
    jest
      .spyOn(TransactionService, 'getRecentTransactions')
      .mockResolvedValue(transactions as any);
    await TransactionController.getRecentTransactions(req, res, next);
    expect(TransactionService.getRecentTransactions).toHaveBeenCalledWith(
      'user123',
      3,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(transactions);
  });
  it('should call next on error', async () => {
    req.user = { _id: 'user123' };
    req.query = { limit: '3' };
    jest
      .spyOn(TransactionService, 'getRecentTransactions')
      .mockRejectedValue(new Error('fail'));
    await TransactionController.getRecentTransactions(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
