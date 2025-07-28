import mongoose, { Schema, Document, Model } from 'mongoose';

const TRANSACTION_TYPES = ['income', 'expense'] as const;
const PAYMENT_METHODS = ['cash', 'card', 'bank_transfer', 'other'] as const;

interface ITransaction extends Document {
  type: (typeof TRANSACTION_TYPES)[number];
  amount: mongoose.Types.Decimal128;

  incomeSource?: mongoose.Types.ObjectId;
  customIncomeSource?: string;

  expenseCategory?: mongoose.Types.ObjectId;
  customExpenseCategory?: string;

  date: Date;
  description?: string;
  user: mongoose.Types.ObjectId;
  paymentMethod: (typeof PAYMENT_METHODS)[number];
  currency: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
    },

    amount: {
      type: Schema.Types.Decimal128,
      required: true,
      min: [0, 'Amount must be positive'],
    },

    //
    incomeSource: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    customIncomeSource: {
      type: String,
      trim: true,
    },

    expenseCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    customExpenseCategory: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: () => new Date(),
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: 'Date cannot be in the future',
      },
    },

    description: {
      type: String,
      default: '',
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'cash',
    },

    currency: {
      type: String,
      default: 'USD',
      minlength: 3,
      maxlength: 3,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1, date: -1 });

//  Custom validator to ensure one of the category fields is provided
transactionSchema.pre('validate', function (this: ITransaction, next) {
  if (this.type === 'income') {
    if (!this.incomeSource && !this.customIncomeSource) {
      return next(
        new Error('Either incomeSource or customIncomeSource must be provided'),
      );
    }
  } else if (this.type === 'expense') {
    if (!this.expenseCategory && !this.customExpenseCategory) {
      return next(
        new Error(
          'Either expenseCategory or customExpenseCategory must be provided',
        ),
      );
    }
  }
  next();
});

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema,
);

export default Transaction;
