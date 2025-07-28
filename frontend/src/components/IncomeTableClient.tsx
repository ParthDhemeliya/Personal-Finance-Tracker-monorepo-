"use client";
import { useState, useEffect } from "react";
import TransactionModal from "@/components/TransactionModal";
import useToast from "@/hooks/useToast";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/Pagination";
import { useAppDispatch } from "@/hooks/useTypedDispatch";
import { useAppSelector } from "@/hooks/useTypedSelector";
import {
  fetchPaginatedIncomes,
  addIncome,
  deleteIncome,
  fetchTotalIncome,
  updateIncome,
} from "@/redux/income/incomeThunk";
import { setPage } from "@/redux/income/incomeSlice";
import type { ITransaction } from "@/types/Transaction";
import type { IncomeEntry, ExpenseEntry } from "@/types/Interface";
import { Wallet } from "lucide-react";
import { IndianRupee } from "lucide-react";

const PAGE_LIMIT = 6;

export default function IncomeTableClient() {
  const dispatch = useAppDispatch();
  const {
    data: incomes,
    currentPage,
    totalPages,
    loading,
    total,
  } = useAppSelector((state) => state.income);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const { showSuccess, showError } = useToast();
  const totalIncome = useAppSelector(
    (state) => state.income.overallTotalIncome,
  );

  useEffect(() => {
    dispatch(fetchPaginatedIncomes({ page: 1, limit: PAGE_LIMIT }));
    dispatch(fetchTotalIncome());
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchPaginatedIncomes({ page, limit: PAGE_LIMIT }));
  };

  const handleAddOrUpdate = async (
    entry: Omit<IncomeEntry, "_id"> | Omit<ExpenseEntry, "_id">,
  ) => {
    if ((entry as Omit<IncomeEntry, "_id">).type === "income") {
      try {
        if (selectedTransaction) {
          await dispatch(
            updateIncome({
              id: selectedTransaction._id,
              data: entry as Omit<IncomeEntry, "_id">,
            }),
          ).unwrap();
        } else {
          await dispatch(addIncome(entry as Omit<IncomeEntry, "_id">)).unwrap();
        }
        dispatch(fetchPaginatedIncomes({ page: 1, limit: PAGE_LIMIT }));
        dispatch(setPage(1));
        dispatch(fetchTotalIncome());
        setModalOpen(false);
        setSelectedTransaction(null);
      } catch (err) {
        console.error("Add/Edit income failed:", err);
        showError("Failed to save income. Please try again.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteIncome(id)).unwrap();
      showSuccess("Income deleted successfully!");
      dispatch(fetchPaginatedIncomes({ page: currentPage, limit: PAGE_LIMIT }));
      dispatch(fetchTotalIncome());
    } catch (err) {
      console.error("Delete income failed:", err);
      showError("Failed to delete income. Please try again.");
    }
  };

  const handleEdit = (tx: ITransaction) => {
    setSelectedTransaction(tx);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 italic">Loading incomes...</p>
    );
  }

  return (
    <>
      {/* Header row: icon, title, add button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Wallet className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Income Overview
          </h1>
        </div>
        <button
          onClick={() => {
            setModalOpen(true);
            setSelectedTransaction(null);
          }}
          className="px-5 py-2 rounded-lg bg-blue-100 text-blue-800 font-semibold border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition cursor-pointer"
        >
          + Add Income
        </button>
      </div>
      {/* Total Income summary card */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm flex items-center gap-2">
        <IndianRupee className="text-blue-600 w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-800">
          Total Income:{" "}
          <span className="text-blue-700 font-bold">
            {totalIncome.toLocaleString()}
          </span>
        </h2>
      </div>
      <TransactionTable
        data={incomes}
        type="income"
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <Pagination
        page={currentPage || 1}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
        total={total || incomes.length}
        pageSize={PAGE_LIMIT}
      />
      {modalOpen && (
        <TransactionModal
          onClose={() => {
            setModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleAddOrUpdate}
          type="income"
          mode={selectedTransaction ? "edit" : "add"}
          initialData={
            selectedTransaction
              ? {
                  ...selectedTransaction,
                  type: "income",
                }
              : undefined
          }
        />
      )}
    </>
  );
}
