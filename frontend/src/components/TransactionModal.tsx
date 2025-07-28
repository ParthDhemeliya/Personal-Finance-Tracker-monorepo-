import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { type ITransaction, type TransactionType } from "../types/Transaction";
import type { PaymentMethod } from "../types/commonTypes";
import CategoryDropdown from "../common/CategoryDropdown";
import useToast from "../hooks/useToast";
type FormData = {
  amount: string;
  categoryId: string;
  date: string;
  description: string;
  paymentMethod: PaymentMethod;
};

import type { IncomeEntry, ExpenseEntry } from "../types/Interface";

interface TransactionModalProps {
  onClose: () => void;
  onSubmit: (
    entry: Omit<IncomeEntry, "_id"> | Omit<ExpenseEntry, "_id">,
  ) => Promise<void>;
  mode: "add" | "edit";
  initialData?: ITransaction;
  type: TransactionType;
}

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id.trim());
// TransactionModal component for adding or editing transactions
// This component handles both adding new transactions and editing existing ones
const TransactionModal = ({
  onClose,
  onSubmit,
  mode,
  type,
  initialData,
}: TransactionModalProps) => {
  const getNowForDateInput = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [customCategoryName, setCustomCategoryName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { showSuccess, showError } = useToast();
  // Form setup using react-hook-form
  // This handles form validation and submission
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: "",
      categoryId: "",
      date: getNowForDateInput(),
      description: "",
      paymentMethod: "cash",
    },
  });

  // Set form values when in edit mode and initialData is available
  useEffect(() => {
    if (mode === "edit" && initialData) {
      let categoryId = "";
      setCustomCategoryName("");

      if (type === "expense") {
        if (typeof initialData.expenseCategory === "string") {
          categoryId = initialData.expenseCategory;
        } else if (
          typeof initialData.expenseCategory === "object" &&
          initialData.expenseCategory &&
          "_id" in initialData.expenseCategory
        ) {
          categoryId = (initialData.expenseCategory as { _id: string })._id;
        } else if (initialData.customExpenseCategory) {
          categoryId = "custom";
          setCustomCategoryName(initialData.customExpenseCategory);
        }
      }

      if (type === "income") {
        if (typeof initialData.incomeSource === "string") {
          categoryId = initialData.incomeSource;
        } else if (
          typeof initialData.incomeSource === "object" &&
          initialData.incomeSource &&
          "_id" in initialData.incomeSource
        ) {
          categoryId = (initialData.incomeSource as { _id: string })._id;
        } else if (initialData.customIncomeSource) {
          categoryId = "custom";
          setCustomCategoryName(initialData.customIncomeSource);
        }
      }

      setValue("amount", initialData.amount.toString());
      setValue("categoryId", categoryId || "");
      const formattedDate = initialData.date.split("T")[0];
      setValue("date", formattedDate);
      setValue("description", initialData.description || "");
      setValue("paymentMethod", initialData.paymentMethod);
    }
  }, [mode, initialData, type, setValue]);

  // We watch categoryId so we can reset customCategoryName when it changes away from "custom"
  const watchedCategoryId = watch("categoryId");

  // Reset customCategoryName when categoryId changes away from "custom"
  // This ensures that if the user selects a predefined category, the custom name is cleared
  useEffect(() => {
    if (watchedCategoryId !== "custom" && mode !== "edit") {
      setCustomCategoryName("");
    }
  }, [watchedCategoryId, mode]);

  // Handle form submission
  // This function is called when the form is submitted
  const onSubmitHandler = async (data: FormData) => {
    let finalCategoryId = data.categoryId;
    if (data.categoryId === "custom" && customCategoryName.trim()) {
      finalCategoryId = customCategoryName.trim();
    }

    const isObjectId = isValidObjectId(finalCategoryId);

    const isoDate =
      data.date.length === 10 ? new Date(data.date).toISOString() : data.date;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let transactionPayload: any;
    if (type === "income") {
      transactionPayload = {
        amount: Number(data.amount),
        date: isoDate,
        description: data.description,
        paymentMethod: data.paymentMethod,
        currency: "USD",
        type: "income",
        incomeSource: isObjectId ? finalCategoryId : undefined,
        customIncomeSource: !isObjectId ? finalCategoryId : undefined,
      };
    } else {
      transactionPayload = {
        amount: Number(data.amount),
        date: isoDate,
        description: data.description,
        paymentMethod: data.paymentMethod,
        currency: "USD",
        type: "expense",
        categoryId: isObjectId ? finalCategoryId : undefined,
        customCategory: !isObjectId ? finalCategoryId : undefined,
      };
    }

    try {
      await onSubmit(transactionPayload);
      const action = mode === "add" ? "added" : "updated";
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      showSuccess(`${capitalizedType} ${action} successfully`);
      onClose();
    } catch (error) {
      console.error("Error submitting transaction:", error);
      showError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 relative"
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-red-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {mode === "add" ? "Add" : "Edit"}{" "}
          {type === "income" ? "Income" : "Expense"}
        </h2>

        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block font-medium mb-1">Amount (₹)</label>
              <input
                {...register("amount", {
                  required: "Amount is required",
                  validate: (value) =>
                    !isNaN(Number(value)) && Number(value) > 0
                      ? true
                      : "Amount must be a positive number",
                })}
                type="number"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. 1000"
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Category or Source Dropdown */}
            <Controller
              key={`${mode}-${type}-${initialData?._id || "new"}`} // 👈 forces reset when editing different entries
              control={control}
              name="categoryId"
              rules={{ required: "Category/Source is required" }}
              render={({ field }) => (
                <CategoryDropdown
                  type={type}
                  value={field.value}
                  customValue={customCategoryName}
                  setValue={(val) => field.onChange(val)}
                  setCustomValue={setCustomCategoryName}
                  error={errors.categoryId?.message}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                />
              )}
            />
            <div>
              <label className="block font-medium mb-1">Date</label>
              <input
                {...register("date", {
                  required: "Date is required",
                  validate: (value) => {
                    const selected = new Date(value);
                    const today = new Date();
                    selected.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    if (selected.getTime() > today.getTime()) {
                      return "Future dates are not allowed";
                    }
                    return true;
                  },
                })}
                type="date"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="YYYY-MM-DD"
                max={getNowForDateInput()}
              />
              {errors.date && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-medium mb-1">Payment Method</label>
              <select
                {...register("paymentMethod")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition"
            >
              {mode === "add" ? "Save" : "Update"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TransactionModal;
