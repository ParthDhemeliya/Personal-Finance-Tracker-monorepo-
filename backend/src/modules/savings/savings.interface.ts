export interface ISavingsGoal {
  _id?: string;
  user: string;
  amount: number;
  targetDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
