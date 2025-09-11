import { Mistral } from "@mistralai/mistralai";
import systemPrompt from "./systemPrompt";

const fetchMistralChatCompletion = async (context, prompt, providers) => {
  const { key: API_KEY, model: MODEL } = providers.mistral;

  const systemMessage = {
    role: "system",
    content: systemPrompt, // This uses your imported string
  };

  const userMessage = {
    role: "user",
    content: prompt,
  };

  const messages = [systemMessage, ...context, userMessage];

  const client = new Mistral({ apiKey: API_KEY });

  try {
    const chatResponse = await client.chat.complete({
      model: MODEL,
      messages,
    });

    const { content, role } = chatResponse.choices[0].message;

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
