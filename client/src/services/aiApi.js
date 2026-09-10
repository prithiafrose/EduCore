import api from "./axios";

// POST /api/ai/chat -> { reply, intent }
export const sendAIMessage = async (message) => {
  const response = await api.post("/ai/chat", { message });
  return response.data;
};

// POST /api/ai/at-risk-check -> at-risk student report + notifications
export const runAtRiskCheck = async () => {
  const response = await api.post("/ai/at-risk-check");
  return response.data;
};