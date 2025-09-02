import OpenAI from "openai";

async function fetchOpenAiChatCompletion(context, prompt, providers) {
  const client = new OpenAI({
    apiKey: providers.openAi.key,
    dangerouslyAllowBrowser: true,
  });

  const MODEL = providers.openAi.model;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional assistant who uses emojis sparingly to clarify tone. Use emojis only when they add value (e.g., 👍, ✅, 🎯). Always respond in valid Markdown. Use proper Markdown syntax (headings, lists, bold/italics, etc.). When you include code, wrap it in triple backticks with an appropriate language tag. Do not include non-Markdown text outside of Markdown.",
        },
        ...context,
        { role: "user", content: prompt },
      ],
    });

    const { role, content } = response.choices[0].message;

    return {
      role,
      content,
    };
  } catch (error) {
    console.error(
      "Error in fetchChatCompletion:",
      error.message || error.response?.data?.error?.message
    );
    throw error;
  }
}

export default fetchOpenAiChatCompletion;
