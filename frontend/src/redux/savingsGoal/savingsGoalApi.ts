import axiosInstance from "../../api/axiosInstance";

export const fetchSavingsGoalApi = async () => {
  const response = await axiosInstance.get("/v1/savings-goal");
  return response.data;
};
