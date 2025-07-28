import { getBalance } from '../../../src/modules/balance/balance.controller';
import * as BalanceService from '../../../src/modules/balance/balance.service';

describe('balance.controller', () => {
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
    await getBalance(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return balance summary if user exists', async () => {
    req.user = { _id: 'user123' };
    const summary = { balance: 100, totalIncome: 200, totalExpense: 100 };
    jest.spyOn(BalanceService, 'getBalanceSummary').mockResolvedValue(summary);
    await getBalance(req, res, next);
    expect(BalanceService.getBalanceSummary).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(summary);
  });

  it('should call next on error', async () => {
    req.user = { _id: 'user123' };
    jest
      .spyOn(BalanceService, 'getBalanceSummary')
      .mockRejectedValue(new Error('fail'));
    await getBalance(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
