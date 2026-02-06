import { GoogleGenAI } from "@google/genai";
import systemPrompt from "./systemPrompt.js";

const fetchGeminiChatCompletion = async (context, apiKey, model) => {
  try {
    const ai = new GoogleGenAI({ apiKey });

    // Filter out system messages and convert to Gemini format
    const filteredContext = context.filter((msg) => msg.role !== "system");

    const history = filteredContext.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: systemPrompt,
      },
      history,
    });

    // Get the last message
    const lastMessage = filteredContext[filteredContext.length - 1];

    const response = await chat.sendMessage({
      message: lastMessage.content,
    });

    return {
      role: "assistant",
      content: response.text,
    };
  } catch (error) {
    console.error(
      "Error in fetchGeminiChatCompletion:",
      error.message || error.response?.data?.error?.message,
    );
    throw error;
  }
};

export default fetchGeminiChatCompletion;
