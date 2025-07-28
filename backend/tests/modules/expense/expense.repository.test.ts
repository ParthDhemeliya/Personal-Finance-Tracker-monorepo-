import { ExpenseRepository } from '../../../src/modules/expense/expense.repository';
import Transaction from '../../../models/Transaction';

describe('expense.repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get category summary by month', async () => {
    jest
      .spyOn(Transaction, 'aggregate')
      .mockResolvedValue([{ category: 'Food', amount: 100 }] as any);
    const result = await ExpenseRepository.getCategorySummaryByMonth(
      'user123',
      '2023-01',
    );
    expect(result[0].category).toBe('Food');
    expect(result[0].amount).toBe(100);
  });
  it('should throw on invalid month', async () => {
    await expect(
      ExpenseRepository.getCategorySummaryByMonth('user123', 'bad'),
    ).rejects.toThrow();
  });

  it('should create expense', async () => {
    jest.spyOn(Transaction, 'create').mockResolvedValue({ _id: 'e1' } as any);
    const result = await ExpenseRepository.create({
      amount: 100,
      user: 'user123',
    } as any);
    expect(Transaction.create).toHaveBeenCalled();
    expect(result._id).toBe('e1');
  });

  it('should find all by user', async () => {
    jest.spyOn(Transaction, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue([{ _id: 'e1' }]),
    } as any);
    const result = await ExpenseRepository.findAllByUser('user123');
    expect(Transaction.find).toHaveBeenCalled();
    expect(result[0]._id).toBe('e1');
  });

  it('should find by id', async () => {
    jest.spyOn(Transaction, 'findOne').mockResolvedValue({ _id: 'e1' } as any);
    const result = await ExpenseRepository.findById('e1');
    expect(Transaction.findOne).toHaveBeenCalled();
    expect(result?._id).toBe('e1');
  });

  it('should update expense', async () => {
    jest
      .spyOn(Transaction, 'findByIdAndUpdate')
      .mockResolvedValue({ _id: 'e1', amount: 200 } as any);
    const result = await ExpenseRepository.update('e1', { amount: 200 });
    expect(Transaction.findByIdAndUpdate).toHaveBeenCalled();
    expect(result?.amount).toBe(200);
  });

  it('should soft delete expense', async () => {
    jest
      .spyOn(Transaction, 'findByIdAndUpdate')
      .mockResolvedValue({ _id: 'e1', isDeleted: true } as any);
    const result = await ExpenseRepository.softDelete('e1');
    expect(Transaction.findByIdAndUpdate).toHaveBeenCalled();
    expect(result?.isDeleted).toBe(true);
  });

  it('should find paginated by user', async () => {
    jest.spyOn(Transaction, 'find').mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ _id: 'e1' }]),
    } as any);
    const result = await ExpenseRepository.findPaginatedByUser('user123', 0, 1);
    expect(Transaction.find).toHaveBeenCalled();
    expect(result[0]._id).toBe('e1');
  });

  it('should count by user', async () => {
    jest.spyOn(Transaction, 'countDocuments').mockResolvedValue(5 as any);
    const result = await ExpenseRepository.countByUser('user123');
    expect(Transaction.countDocuments).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it('should calculate total amount', async () => {
    jest
      .spyOn(Transaction, 'aggregate')
      .mockResolvedValue([{ total: 123 }] as any);
    const result = await ExpenseRepository.calculateTotalAmount('user123');
    expect(result.total).toBe(123);
  });

  it('should update by user', async () => {
    jest
      .spyOn(Transaction, 'findOneAndUpdate')
      .mockResolvedValue({ _id: 'e1', amount: 300 } as any);
    const result = await ExpenseRepository.updateByUser(
      'e1',
      { amount: 300 },
      'user123',
    );
    expect(Transaction.findOneAndUpdate).toHaveBeenCalled();
    expect(result?.amount).toBe(300);
  });

  it('should soft delete by user', async () => {
    jest
      .spyOn(Transaction, 'findOneAndUpdate')
      .mockResolvedValue({ _id: 'e1', isDeleted: true } as any);
    const result = await ExpenseRepository.softDeleteByUser('e1', 'user123');
    expect(Transaction.findOneAndUpdate).toHaveBeenCalled();
    expect(result?.isDeleted).toBe(true);
  });
});
