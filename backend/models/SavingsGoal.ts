import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavingsGoalDoc extends Document {
  user: mongoose.Types.ObjectId | string;
  amount: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SavingsGoalSchema = new Schema<ISavingsGoalDoc>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  targetDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SavingsGoalSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

SavingsGoalSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const SavingsGoal: Model<ISavingsGoalDoc> = mongoose.model<ISavingsGoalDoc>(
  'SavingsGoal',
  SavingsGoalSchema,
);
export default SavingsGoal;
