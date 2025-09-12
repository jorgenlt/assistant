import axios from "axios";
import { BASE_API_URL } from "../app/config";

async function generateConversationTitle(id, prompt, userId) {
  try {
    const url = `${BASE_API_URL}/conversations/id/title/generate`;
    const response = await axios.post(url, {
      id,
      prompt,
      userId,
    });

    return response.data.title;
  } catch (error) {
    console.error(
      "An error occured in generateConversationTitle",
      error.message
    );
  }
}

export default generateConversationTitle;
