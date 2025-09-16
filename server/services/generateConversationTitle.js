import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";

const generateConversationTitle = async (prompt, apiKey, provider, model) => {
  const systemPrompt =
    "You are a helpful assistant. Summarize the user's first message into a very short, clear title (max 5 words). Add an emoji at the end if there is one that fits the message. Return only the title.";

  if (provider === "mistral") {
    try {
      const client = new Mistral({ apiKey });

      const response = await client.chat.complete({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(error);
    }
  }

  if (provider === "openAi") {
    const client = new OpenAI({
      apiKey,
    });

    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default generateConversationTitle;
