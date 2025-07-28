export interface IBudget {
  _id?: string;
  user: string;
  category: string;
  amount: number;
  period: 'month' | 'year';
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
