import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";
import systemPrompt from "./systemPrompt.js";

const fetchXaiChatCompletion = async (context, apiKey, model) => {
  try {
    const customXai = createXai({ apiKey });

    const { text } = await generateText({
      model: customXai(model),
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
