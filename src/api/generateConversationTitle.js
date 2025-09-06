import OpenAI from "openai";

async function generateConversationTitle(firstMessage, providers) {
  const client = new OpenAI({
    apiKey: providers.openAi.key,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await client.chat.completions.create({
      model: providers.default.model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Summarize the user's first message into a very short, clear title (max 5 words). Add an emoji at the end if there is one that fits the message. Return only the title.",
        },
        {
          role: "user",
          content: firstMessage,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      "Error in generateConversationTitle:",
      error.message || error.response?.data?.error?.message
    );
    throw error;
  }
}

export default generateConversationTitle;
