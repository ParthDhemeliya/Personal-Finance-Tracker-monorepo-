import { Types } from 'mongoose';
import Transaction from '../../../models/Transaction.js';
import { IncomeInput } from './income.interface.js';

export const IncomeRepository = {
  create: async (data: IncomeInput) => {
    return Transaction.create(data);
  },

  findAllByUser: async (userId: string) => {
    return Transaction.find({ user: userId, type: 'income' })
      .populate('incomeSource', 'name color')
      .sort({ date: -1 });
  },

  //  Add pagination method
  findPaginatedByUser: async (userId: string, page = 1, limit = 6) => {
    const skip = (page - 1) * limit;

    const query = {
      user: new Types.ObjectId(userId),
      type: 'income',
    };

    const [data, total] = await Promise.all([
      Transaction.find(query)
        .populate('incomeSource', 'name color')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(query),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },

  updateById: async (
    id: string,
    userId: string,
    updates: Partial<IncomeInput>,
  ) => {
    return Transaction.findOneAndUpdate(
      { _id: id, user: userId, type: 'income' },
      updates,
      { new: true },
    ).populate('incomeSource', 'name color');
  },

  deleteById: async (id: string, userId: string) => {
    return Transaction.findOneAndDelete({
      _id: id,
      user: userId,
      type: 'income',
    });
  },
};
