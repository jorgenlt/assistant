import { Mistral } from "@mistralai/mistralai";
import systemPrompt from "./systemPrompt.js";

const fetchMistralChatCompletion = async (context, apiKey, model) => {
  try {
    const systemMessage = {
      role: "system",
      content: systemPrompt,
    };

    const messages = [systemMessage, ...context];

    const client = new Mistral({ apiKey });

    const response = await client.chat.complete({
      model,
      messages,
    });

    const { content, role } = response.choices[0].message;

    return {
      role,
      content,
    };
  } catch (error) {
    console.error(
      "Error in fetchMistralChatCompletion:",
      error.message || error.response?.data?.error?.message
    );
    throw error;
  }
};

export default fetchMistralChatCompletion;
