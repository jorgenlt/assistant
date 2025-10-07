import axios from "axios";
import { BASE_API_URL } from "../app/config";

const generateConversationTitle = async (
  conversationId,
  prompt,
  userId,
  token
) => {
  try {
    const url = `${BASE_API_URL}/conversations/id/title/generate`;
    const response = await axios.post(
      url,
      {
        conversationId,
        prompt,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.title;
  } catch (error) {
    throw new Error(error);
  }
};

export default generateConversationTitle;
