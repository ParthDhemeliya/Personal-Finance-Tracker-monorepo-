import axiosInstance from "../../api/axiosInstance";
export const fetchExpenseCategorySummaryApi = async (month: string) => {
  const response = await axiosInstance.get(
    `/v1/expenses/category-summary?month=${month}`,
  );
  return response.data;
};
