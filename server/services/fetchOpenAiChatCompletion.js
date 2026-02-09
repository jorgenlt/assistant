import OpenAI from "openai";
import systemPrompt from "./systemPrompt.js";

const fetchOpenAiChatCompletion = async (context, apiKey, model) => {
  try {
    const systemMessage = {
      role: "system",
      content: systemPrompt,
    };

    const messages = [systemMessage, ...context];

    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: false });

    const response = await client.chat.completions.create({
      model,
      messages,
    });

    const { role, content } = response.choices[0].message;

    return { role, content };
  } catch (error) {
    console.error(
      "Error in fetchMistralChatCompletion:",
      error.message || error.response?.data?.error?.message,
    );
    throw error;
  }
};

export default fetchOpenAiChatCompletion;
