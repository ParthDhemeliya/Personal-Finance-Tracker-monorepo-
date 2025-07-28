import * as BalanceRepo from '../../../src/modules/balance/balance.repository';
import { getBalanceSummary } from '../../../src/modules/balance/balance.service';

describe('balance.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct balance summary', async () => {
    jest.spyOn(BalanceRepo, 'getTotalIncome').mockResolvedValue(300);
    jest.spyOn(BalanceRepo, 'getTotalExpense').mockResolvedValue(100);
    const result = await getBalanceSummary('user123');
    expect(BalanceRepo.getTotalIncome).toHaveBeenCalledWith('user123');
    expect(BalanceRepo.getTotalExpense).toHaveBeenCalledWith('user123');
    expect(result).toEqual({
      balance: 200,
      totalIncome: 300,
      totalExpense: 100,
    });
  });

  it('should propagate errors from repository', async () => {
    jest
      .spyOn(BalanceRepo, 'getTotalIncome')
      .mockRejectedValue(new Error('fail'));
    await expect(getBalanceSummary('user123')).rejects.toThrow('fail');
  });
});
