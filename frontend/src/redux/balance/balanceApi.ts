import axios from "../../api/axiosInstance";

export const fetchBalance = async () => {
  const response = await axios.get("/v1/balance");
  return response.data;
};
