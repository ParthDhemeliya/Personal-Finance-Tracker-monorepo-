import axiosInstance from "../../api/axiosInstance";

export const fetchExpenseStatsApi = async () => {
  const response = await axiosInstance.get("/v1/expenses/stats?period=month");
  return response.data;
};
