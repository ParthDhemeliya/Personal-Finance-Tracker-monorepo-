import * as BalanceRepo from '../../../src/modules/balance/balance.repository';
import Transaction from '../../../models/Transaction';

describe('balance.repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalIncome', () => {
    it('should return total income if aggregation result exists', async () => {
      jest
        .spyOn(Transaction, 'aggregate')
        .mockResolvedValue([{ total: 150 }] as any);
      const result = await BalanceRepo.getTotalIncome('user123');
      expect(Transaction.aggregate).toHaveBeenCalled();
      expect(result).toBe(150);
    });
    it('should return 0 if aggregation result is empty', async () => {
      jest.spyOn(Transaction, 'aggregate').mockResolvedValue([] as any);
      const result = await BalanceRepo.getTotalIncome('user123');
      expect(result).toBe(0);
    });
  });

  describe('getTotalExpense', () => {
    it('should return total expense if aggregation result exists', async () => {
      jest
        .spyOn(Transaction, 'aggregate')
        .mockResolvedValue([{ total: 75 }] as any);
      const result = await BalanceRepo.getTotalExpense('user123');
      expect(Transaction.aggregate).toHaveBeenCalled();
      expect(result).toBe(75);
    });
    it('should return 0 if aggregation result is empty', async () => {
      jest.spyOn(Transaction, 'aggregate').mockResolvedValue([] as any);
      const result = await BalanceRepo.getTotalExpense('user123');
      expect(result).toBe(0);
    });
  });
});
