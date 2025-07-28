import { TrendingUp, CreditCard } from "lucide-react";
import { useAppSelector } from "../hooks/useTypedSelector";
import type { ITransaction } from "../types/Transaction";

// RecentTransactionsList component to display recent transactions
// This component fetches and displays the most recent transactions
const RecentTransactionsList = () => {
  const recentTransactions = useAppSelector(
    (state) => state.recentTransactions.data as ITransaction[],
  );
  // Check if recent transactions are loading or if there's an error
  const recentTransactionsLoading = useAppSelector(
    (state) => state.recentTransactions.loading,
  );
  // Error message if fetching recent transactions fails
  const recentTransactionsError = useAppSelector(
    (state) => state.recentTransactions.error,
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-bold text-purple-700 mb-2 tracking-wide flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-purple-500" /> Recent Transactions
      </h3>
      {recentTransactionsLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : recentTransactionsError ? (
        <div className="text-center text-red-500">
          {recentTransactionsError}
        </div>
      ) : recentTransactions.length === 0 ? (
        <div className="text-center text-gray-500">
          No recent transactions found.
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === "income";
            // Support MongoDB Decimal128 object or number
            interface DecimalAmount {
              $numberDecimal: string;
            }
            let amount: number = 0;
            if (typeof tx.amount === "number") {
              amount = tx.amount;
            } else if (
              tx.amount &&
              typeof tx.amount === "object" &&
              "$numberDecimal" in (tx.amount as DecimalAmount)
            ) {
              amount = parseFloat((tx.amount as DecimalAmount).$numberDecimal);
            }
            let category = "";
            if (isIncome) {
              if (
                typeof tx.incomeSource === "object" &&
                tx.incomeSource &&
                "name" in tx.incomeSource
              ) {
                category = tx.incomeSource.name;
              } else if (typeof tx.incomeSource === "string") {
                category = tx.incomeSource;
              } else if (tx.customIncomeSource) {
                category = tx.customIncomeSource;
              } else {
                category = "Income";
              }
            } else {
              if (
                typeof tx.expenseCategory === "object" &&
                tx.expenseCategory &&
                "name" in tx.expenseCategory
              ) {
                category = tx.expenseCategory.name;
              } else if (typeof tx.expenseCategory === "string") {
                category = tx.expenseCategory;
              } else if (tx.customExpenseCategory) {
                category = tx.customExpenseCategory;
              } else {
                category = "Expense";
              }
            }
            const iconBg = isIncome ? "bg-green-200" : "bg-red-200";
            const iconColor = isIncome ? "text-green-700" : "text-red-700";
            const Icon = isIncome ? TrendingUp : CreditCard;

            const txDate = new Date(tx.createdAt ?? "");
            const now = new Date();
            let dateLabel = txDate.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            });
            const isToday = txDate.toDateString() === now.toDateString();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const isYesterday =
              txDate.toDateString() === yesterday.toDateString();
            if (isToday) {
              dateLabel = `Today, ${txDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
            } else if (isYesterday) {
              dateLabel = `Yesterday, ${txDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
            }
            return (
              <div
                className="flex justify-between items-center bg-white/90 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 px-4 py-3 group hover:bg-purple-100"
                key={tx._id}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`${iconColor} w-5 h-5`} />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-purple-800 transition-colors duration-200">
                      {tx.description || category}
                    </p>
                    <p className="text-sm text-gray-500">{dateLabel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${isIncome ? "text-green-700" : "text-red-700"}`}
                  >
                    {isIncome ? "+" : "-"}₹{Math.abs(amount).toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${isIncome ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsList;
