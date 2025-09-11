import { BASE_API_URL } from "../app/config";
import axios from "axios";

const chatCompletion = async (currentId, userId, prompt, provider, model) => {
  try {
    const url = `${BASE_API_URL}/conversations/${currentId}/messages`;

    const response = await axios.post(url, {
      currentId,
      userId,
      role: "user",
      content: prompt,
      provider,
      model,
    });

    if (response.status === 200) {
      return response.data.response;
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error;
  }
};

export default chatCompletion;
