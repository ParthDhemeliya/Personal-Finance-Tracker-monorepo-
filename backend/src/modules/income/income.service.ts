import { Types } from 'mongoose';
import { IncomeRepository } from './income.repository.js';
import { IncomeInputRaw, IncomeInput } from './income.interface.js';
import Transaction from '../../../models/Transaction.js';

// ✅ Normalize amount + populate incomeSource field correctly
function normalizeAmount(income: any) {
  const obj = income.toObject();
  return {
    ...obj,
    amount: parseFloat(obj.amount.toString()),
    incomeSource:
      obj.incomeSource && typeof obj.incomeSource === 'object'
        ? {
            _id: obj.incomeSource._id,
            name: obj.incomeSource.name,
            color: obj.incomeSource.color,
          }
        : obj.incomeSource,
  };
}

export const IncomeService = {
  createIncome: async (data: IncomeInputRaw & { user: string }) => {
    const payload: IncomeInput = {
      amount: data.amount,
      date: data.date,
      description: data.description,
      paymentMethod: data.paymentMethod,
      currency: data.currency,
      user: new Types.ObjectId(data.user),
      type: 'income',
    };

    if (data.incomeSource && Types.ObjectId.isValid(data.incomeSource)) {
      payload.incomeSource = new Types.ObjectId(data.incomeSource);
    }

    if (typeof data.customIncomeSource === 'string') {
      payload.customIncomeSource = data.customIncomeSource.trim();
    }

    const income = await IncomeRepository.create(payload);
    return normalizeAmount(income);
  },
  getPaginatedIncomes: (userId: string, page = 1, limit = 6) => {
    return IncomeRepository.findPaginatedByUser(userId, page, limit).then(
      ({ data, ...meta }) => ({
        ...meta,
        data: data.map(normalizeAmount),
      }),
    );
  },

  getTotalIncomeAmount: async (userId: string) => {
    const result = await Transaction.aggregate([
      { $match: { user: new Types.ObjectId(userId), type: 'income' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result[0]?.total || 0;
  },

  getIncomes: (userId: string) =>
    IncomeRepository.findAllByUser(userId).then((incomes) =>
      incomes.map(normalizeAmount),
    ),

  updateIncome: (
    id: string,
    userId: string,
    updates: Partial<IncomeInputRaw>,
  ) => {
    const convertedUpdates: Partial<IncomeInput> = {
      amount: updates.amount,
      date: updates.date,
      description: updates.description,
      paymentMethod: updates.paymentMethod,
      currency: updates.currency,
    };

    //  Safely handle incomeSource
    if (updates.incomeSource && Types.ObjectId.isValid(updates.incomeSource)) {
      convertedUpdates.incomeSource = new Types.ObjectId(updates.incomeSource);
    }

    // Only assign customIncomeSource if it's a non-null string
    if (typeof updates.customIncomeSource === 'string') {
      convertedUpdates.customIncomeSource = updates.customIncomeSource.trim();
    }

    return IncomeRepository.updateById(id, userId, convertedUpdates).then(
      normalizeAmount,
    );
  },
  deleteIncome: (id: string, userId: string) =>
    IncomeRepository.deleteById(id, userId),
};
