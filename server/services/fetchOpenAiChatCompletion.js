import { createXai } from "@ai-sdk/xai"; // ← import createXai instead of (or in addition to) xai
import { generateText } from "ai";
import systemPrompt from "./systemPrompt.js";

const fetchXaiChatCompletion = async (context, apiKey, model) => {
  try {
    // Create a fresh provider instance with the passed apiKey
    const customXai = createXai({ apiKey });

    const { text } = await generateText({
      model: customXai(model), // use the custom instance
      system: systemPrompt,
      messages: context,
    });

    return {
      role: "assistant",
      content: text,
    };
  } catch (error) {
    console.error("Error in fetchXaiChatCompletion:", error);
    throw error;
  }
};

export default fetchXaiChatCompletion;
