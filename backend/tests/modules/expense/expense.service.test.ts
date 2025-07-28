import { ExpenseService } from '../../../src/modules/expense/expense.service';
import { ExpenseRepository } from '../../../src/modules/expense/expense.repository';
import Transaction from '../../../models/Transaction';
import { AppError } from '../../../src/utils/error/AppError';

describe('expense.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create expense and normalize amount', async () => {
    jest
      .spyOn(ExpenseRepository, 'create')
      .mockResolvedValue({
        toObject: () => ({ amount: '100.5' }),
        amount: '100.5',
      } as any);
    const result = await ExpenseService.createExpense(
      { amount: 100 } as any,
      'user123',
    );
    expect(result.amount).toBe(100.5);
  });

  it('should get all expenses and normalize amounts', async () => {
    jest.spyOn(ExpenseRepository, 'findAllByUser').mockResolvedValue([
      { toObject: () => ({ amount: '50' }), amount: '50' },
      { toObject: () => ({ amount: '25' }), amount: '25' },
    ] as any);
    const result = await ExpenseService.getAllExpenses('user123');
    expect(result[0].amount).toBe(50);
    expect(result[1].amount).toBe(25);
  });

  it('should update expense and normalize amount', async () => {
    jest
      .spyOn(ExpenseRepository, 'updateByUser')
      .mockResolvedValue({
        toObject: () => ({ amount: '77' }),
        amount: '77',
      } as any);
    const result = await ExpenseService.updateExpense(
      'e1',
      { amount: 77 },
      'user123',
    );
    expect(result.amount).toBe(77);
  });
  it('should throw if update not found', async () => {
    jest.spyOn(ExpenseRepository, 'updateByUser').mockResolvedValue(null);
    await expect(
      ExpenseService.updateExpense('e1', { amount: 77 }, 'user123'),
    ).rejects.toThrow(AppError);
  });

  it('should delete expense', async () => {
    jest
      .spyOn(ExpenseRepository, 'softDeleteByUser')
      .mockResolvedValue({} as any);
    const result = await ExpenseService.deleteExpense('e1', 'user123');
    expect(result).toBeDefined();
  });
  it('should throw if delete not found', async () => {
    jest.spyOn(ExpenseRepository, 'softDeleteByUser').mockResolvedValue(null);
    await expect(ExpenseService.deleteExpense('e1', 'user123')).rejects.toThrow(
      AppError,
    );
  });

  it('should get paginated expenses', async () => {
    jest
      .spyOn(ExpenseRepository, 'findPaginatedByUser')
      .mockResolvedValue([
        { toObject: () => ({ amount: '10' }), amount: '10' },
      ] as any);
    jest.spyOn(ExpenseRepository, 'countByUser').mockResolvedValue(1);
    const result = await ExpenseService.getPaginatedExpenses(1, 1, 'user123');
    expect(result.data[0].amount).toBe(10);
    expect(result.total).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('should calculate total amount', async () => {
    jest
      .spyOn(Transaction, 'aggregate')
      .mockResolvedValue([{ total: '123.45' }] as any);
    const result = await ExpenseService.calculateTotalAmount('user123');
    expect(result.total).toBe(123.45);
  });
  it('should return 0 if no total', async () => {
    jest.spyOn(Transaction, 'aggregate').mockResolvedValue([] as any);
    const result = await ExpenseService.calculateTotalAmount('user123');
    expect(result.total).toBe(0);
  });
});
