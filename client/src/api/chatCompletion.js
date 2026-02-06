import { BASE_API_URL } from "../app/config";
import axios from "axios";

const chatCompletion = async (
  conversationId,
  userId,
  prompt,
  provider,
  model,
  token
) => {
  try {
    const url = `${BASE_API_URL}/conversations/${conversationId}/messages`;

    const response = await axios.post(
      url,
      {
        conversationId,
        userId,
        role: "user",
        content: prompt,
        provider,
        model,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.response;
    }
  } catch (error) {
    const err = error?.response?.data?.error || error;
    throw err;
  }
};

export default chatCompletion;
