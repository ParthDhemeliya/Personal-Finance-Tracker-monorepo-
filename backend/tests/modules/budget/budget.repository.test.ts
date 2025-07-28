import * as BudgetRepo from '../../../src/modules/budget/budget.repository';
import Budget from '../../../models/Budget';

describe('budget.repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find budgets by user', async () => {
    const budgets = [{ _id: 'b1' }];
    jest.spyOn(Budget, 'find').mockResolvedValue(budgets as any);
    const result = await BudgetRepo.findBudgetsByUser('user123');
    expect(Budget.find).toHaveBeenCalledWith({ user: 'user123' });
    expect(result).toBe(budgets);
  });

  it('should create a budget', async () => {
    const budget = { _id: 'b1', amount: 100 };
    jest.spyOn(Budget, 'create').mockResolvedValue(budget as any);
    const result = await BudgetRepo.createBudget(budget as any);
    expect(Budget.create).toHaveBeenCalledWith(budget);
    expect(result).toBe(budget);
  });

  it('should update a budget', async () => {
    const updated = { _id: 'b1', amount: 200 };
    jest.spyOn(Budget, 'findOneAndUpdate').mockResolvedValue(updated as any);
    const result = await BudgetRepo.updateBudget('b1', 'user123', {
      amount: 200,
    });
    expect(Budget.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'b1', user: 'user123' },
      { amount: 200 },
      { new: true },
    );
    expect(result).toBe(updated);
  });

  it('should delete a budget', async () => {
    const deleted = { _id: 'b1' };
    jest.spyOn(Budget, 'findOneAndDelete').mockResolvedValue(deleted as any);
    const result = await BudgetRepo.deleteBudget('b1', 'user123');
    expect(Budget.findOneAndDelete).toHaveBeenCalledWith({
      _id: 'b1',
      user: 'user123',
    });
    expect(result).toBe(deleted);
  });
});
