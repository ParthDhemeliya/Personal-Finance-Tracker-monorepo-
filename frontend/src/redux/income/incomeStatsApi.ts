import axiosInstance from "../../api/axiosInstance";

export const fetchIncomeStats = async () => {
  const response = await axiosInstance.get("/v1/incomes/stats?period=month");
  // Expecting { amount, percentChange }
  return response.data;
};
