"use client";
import { useState, useEffect } from "react";
import TransactionModal from "@/components/TransactionModal";
import useToast from "@/hooks/useToast";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/Pagination";
import { useAppDispatch } from "@/hooks/useTypedDispatch";
import { useAppSelector } from "@/hooks/useTypedSelector";
import {
  fetchPaginatedExpenses,
  addExpense,
  deleteExpense,
  fetchTotalExpenses,
  updateExpense,
} from "@/redux/expense/expense.thunks";
import { setPage } from "@/redux/expense/expense.slice";
import type { ITransaction } from "@/types/Transaction";
import type { ExpenseEntry, IncomeEntry } from "@/types/Interface";
import { Wallet } from "lucide-react";
import { mapITransactionToExpenseEntry } from "@/utils/transactionMapper";

const PAGE_LIMIT = 6;

export default function ExpenseTableClient() {
  const dispatch = useAppDispatch();
  const {
    data: expenses,
    page: currentPage,
    totalPages,
    loading,
    total,
  } = useAppSelector((state) => state.expenses);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const { showSuccess, showError } = useToast();
  const [error, setError] = useState<string>("");
  const totalExpense = useAppSelector((state) => state.expenses.totalAmount);

  useEffect(() => {
    dispatch(fetchPaginatedExpenses({ page: 1, limit: PAGE_LIMIT }));
    dispatch(fetchTotalExpenses());
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchPaginatedExpenses({ page, limit: PAGE_LIMIT }));
  };

  const handleAddOrUpdate = async (
    entry: Omit<IncomeEntry, "_id"> | Omit<ExpenseEntry, "_id">,
  ) => {
    if ((entry as Omit<ExpenseEntry, "_id">).type === "expense") {
      try {
        if (selectedTransaction) {
          await dispatch(
            updateExpense({
              id: selectedTransaction._id,
              data: entry as Omit<ExpenseEntry, "_id">,
            }),
          ).unwrap();
        } else {
          await dispatch(
            addExpense(entry as Omit<ExpenseEntry, "_id">),
          ).unwrap();
        }
        dispatch(fetchPaginatedExpenses({ page: 1, limit: PAGE_LIMIT }));
        dispatch(setPage(1));
        dispatch(fetchTotalExpenses());
        setModalOpen(false);
        setSelectedTransaction(null);
      } catch (err) {
        console.error("Add/Edit expense failed:", err);
        showError("Failed to save expense. Please try again.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
      showSuccess("Expense deleted successfully!");
      dispatch(
        fetchPaginatedExpenses({ page: currentPage, limit: PAGE_LIMIT }),
      );
      dispatch(fetchTotalExpenses());
    } catch (err) {
      console.error("Delete expense failed:", err);
      showError("Failed to delete expense. Please try again.");
    }
  };

  const handleEdit = (tx: ITransaction) => {
    setSelectedTransaction(tx);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 italic">Loading expenses...</p>
    );
  }
  if (error === "unauthorized") {
    return (
      <div className="text-center mt-10 text-red-500">
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
        <p>You must be logged in to view the expense page.</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <h1 className="text-2xl font-semibold">Error</h1>
        <p>Something went wrong while loading the expense page.</p>
      </div>
    );
  }

  return (
    <>
      {/* Header row: icon, title, add button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Wallet className="w-8 h-8 text-red-600" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Expense Overview
          </h1>
        </div>
        <button
          onClick={() => {
            setModalOpen(true);
            setSelectedTransaction(null);
          }}
          className="px-5 py-2 rounded-lg bg-red-100 text-red-800 font-semibold border border-red-200 hover:bg-red-200 hover:text-red-900 transition cursor-pointer"
        >
          + Add Expense
        </button>
      </div>
      {/* Total Expense summary card */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm flex items-center gap-2">
        <Wallet className="text-red-600 w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-800">
          Total Expense:{" "}
          <span className="text-red-700 font-bold">
            {totalExpense.toLocaleString()}
          </span>
        </h2>
      </div>
      <TransactionTable
        data={expenses}
        type="expense"
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <Pagination
        page={currentPage || 1}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
        total={total || expenses.length}
        pageSize={PAGE_LIMIT}
      />
      {modalOpen && (
        <TransactionModal
          onClose={() => {
            setModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleAddOrUpdate}
          type="expense"
          mode={selectedTransaction ? "edit" : "add"}
          initialData={
            selectedTransaction
              ? {
                  ...selectedTransaction,
                  type: "expense",
                }
              : undefined
          }
        />
      )}
    </>
  );
}
