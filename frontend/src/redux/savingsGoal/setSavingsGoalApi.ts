import axiosInstance from "../../api/axiosInstance";

// Use PUT for updating the savings goal
export const setSavingsGoalApi = async (
  payload: { amount: number; targetDate: string },
  isCreate: boolean = false,
) => {
  if (isCreate) {
    const response = await axiosInstance.post("/v1/savings-goal", payload);
    return response.data;
  } else {
    const response = await axiosInstance.put("/v1/savings-goal", payload);
    return response.data;
  }
};
