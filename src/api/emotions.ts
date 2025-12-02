import { apiClient } from "./api";

export const getEmotions = async (id: string) => {
  const { data } = await apiClient.get(`/video/${id}/charts`);
  return data;
};
