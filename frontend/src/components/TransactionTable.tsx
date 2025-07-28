import { useState } from "react";
import { IndianRupee, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { ITransaction, TransactionType } from "../types/Transaction";
import type { TransactionEntry } from "../types/Interface";
import { mapIncomeEntryToTransaction } from "../utils/transactionMapper";
import { useAppSelector } from "../hooks/useTypedSelector";

interface TransactionTableProps {
  data: TransactionEntry[];
  type: TransactionType;
  onDelete: (id: string) => void;
  onEdit?: (tx: ITransaction) => void;
}
//  TransactionTable component to display transactions in a table format
// This component is used for both income and expense transactions
const TransactionTable = ({
  data = [],
  type,
  onDelete,
  onEdit,
}: TransactionTableProps) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: "amount" | "date";
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });

  const totalIncome = useAppSelector(
    (state) => state.income.overallTotalIncome,
  );
  const totalExpense = useAppSelector((state) => state.expenses.totalAmount);

  // Add type guard for MongoDB Decimal128 objects
  function isDecimalObj(val: any): val is { $numberDecimal: string } {
    return val && typeof val === "object" && "$numberDecimal" in val;
  }

  // Sorting logic for table data based on amount or date
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === "amount") {
      const aAmount =
        typeof a.amount === "number"
          ? a.amount
          : isDecimalObj(a.amount)
            ? parseFloat(
                (a.amount as { $numberDecimal: string }).$numberDecimal,
              )
            : 0;
      const bAmount =
        typeof b.amount === "number"
          ? b.amount
          : isDecimalObj(b.amount)
            ? parseFloat(
                (b.amount as { $numberDecimal: string }).$numberDecimal,
              )
            : 0;
      return sortConfig.direction === "asc"
        ? aAmount - bAmount
        : bAmount - aAmount;
    } else if (sortConfig.key === "date") {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
    }
    return 0;
  });

  const handleSort = (key: "amount" | "date") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Render the category name based on the transaction type (income/expense)
  // Handles both string and object category representations
  const renderCategoryName = (tx: TransactionEntry) => {
    if (tx.type === "income") {
      if (typeof tx.incomeSource === "string") return tx.incomeSource;
      if (tx.incomeSource && typeof tx.incomeSource === "object")
        return tx.incomeSource.name;
      if (tx.customIncomeSource) return tx.customIncomeSource;
    }

    if (tx.type === "expense") {
      if (typeof tx.expenseCategory === "string") return tx.expenseCategory;
      if (tx.expenseCategory && typeof tx.expenseCategory === "object")
        return tx.expenseCategory.name;
      if (tx.customExpenseCategory) return tx.customExpenseCategory;
    }

    return "—";
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm md:text-base text-gray-800">
          <thead className="bg-blue-50 uppercase text-gray-700">
            <tr>
              <th className="px-4 md:px-6 py-4 text-left whitespace-nowrap">
                {type === "income" ? "Source" : "Category"}
              </th>
              <th
                className="px-4 md:px-6 py-4 text-left whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort("amount")}
              >
                Amount
                <span className="inline-flex flex-row ml-1 align-middle">
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === "amount" && sortConfig.direction === "asc" ? "text-blue-600 font-bold" : "text-gray-400"}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === "amount" && sortConfig.direction === "desc" ? "text-blue-600 font-bold" : "text-gray-400"}`}
                  />
                </span>
              </th>
              <th
                className="px-4 md:px-6 py-4 text-left whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort("date")}
              >
                Date
                <span className="inline-flex flex-row ml-1 align-middle">
                  <ArrowUp
                    className={`w-4 h-4 ${sortConfig.key === "date" && sortConfig.direction === "asc" ? "text-blue-600 font-bold" : "text-gray-400"}`}
                  />
                  <ArrowDown
                    className={`w-4 h-4 ${sortConfig.key === "date" && sortConfig.direction === "desc" ? "text-blue-600 font-bold" : "text-gray-400"}`}
                  />
                </span>
              </th>
              <th className="px-4 md:px-6 py-4 text-left whitespace-nowrap">
                Description
              </th>
              <th className="px-4 md:px-6 py-4 text-left whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.slice(0, 6).map((tx, idx) => (
              <tr
                key={tx._id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 border-t border-gray-200 transition`}
              >
                <td className="px-4 md:px-6 py-4 font-medium whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-1 text-xs md:text-sm font-semibold rounded-full ${
                      type === "income"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {renderCategoryName(tx)}
                  </span>
                </td>

                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 md:gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-500" />
                    <span>
                      {typeof tx.amount === "number"
                        ? tx.amount.toLocaleString()
                        : isDecimalObj(tx.amount) &&
                            typeof (tx.amount as any).$numberDecimal ===
                              "string"
                          ? parseFloat(
                              (tx.amount as any).$numberDecimal,
                            ).toLocaleString()
                          : "0"}
                    </span>
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                <td className="px-4 md:px-6 py-4 text-gray-600 whitespace-nowrap">
                  {tx.description || "—"}
                </td>

                <td className="px-4 md:px-6 py-4 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center whitespace-nowrap">
                  {onEdit && type === "income" && tx.type === "income" && (
                    <button
                      onClick={() => onEdit(mapIncomeEntryToTransaction(tx))}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onEdit && type === "expense" && tx.type === "expense" && (
                    <button
                      onClick={() => onEdit(tx as ITransaction)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTargetId(tx._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semibold transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic text-base"
                >
                  No {type} records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.slice(0, 6).map((tx) => (
          <div
            key={tx._id}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    type === "income"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {renderCategoryName(tx)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-lg font-semibold">
                <IndianRupee className="w-4 h-4 text-gray-500" />
                <span>{tx.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>
                  {new Date(tx.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {tx.description && (
                <div className="flex justify-between">
                  <span className="font-medium">Description:</span>
                  <span className="text-right flex-1 ml-2">
                    {tx.description}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
              {onEdit && type === "income" && tx.type === "income" && (
                <button
                  onClick={() => onEdit(mapIncomeEntryToTransaction(tx))}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition flex-1 justify-center py-2 rounded border border-blue-200 hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              {onEdit && type === "expense" && tx.type === "expense" && (
                <button
                  onClick={() => onEdit(tx as ITransaction)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition flex-1 justify-center py-2 rounded border border-blue-200 hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={() => setDeleteTargetId(tx._id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semibold transition flex-1 justify-center py-2 rounded border border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500 italic text-base bg-white rounded-lg border border-gray-200">
            No {type} records found.
          </div>
        )}
        {/* Show total below the cards for mobile */}
        <div className="w-full text-right mt-4 text-lg font-semibold text-blue-800">
          {type === "income" && (
            <span>Total Income: {totalIncome.toLocaleString()}</span>
          )}
          {type === "expense" && (
            <span>Total Expense: {totalExpense.toLocaleString()}</span>
          )}
        </div>
      </div>

      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full border border-gray-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionTable;
