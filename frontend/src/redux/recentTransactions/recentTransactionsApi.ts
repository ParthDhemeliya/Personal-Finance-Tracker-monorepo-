import axiosInstance from "../../api/axiosInstance";
import type { TransactionEntry } from "../../types/Interface";

export const fetchRecentTransactionsApi = async (
  limit = 5,
): Promise<TransactionEntry[]> => {
  const response = await axiosInstance.get(
    `/v1/transactions/recent?limit=${limit}`,
  );
  return response.data;
};
