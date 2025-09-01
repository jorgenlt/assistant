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
        ...context,
        {
          role: "user",
          content: prompt,
        },
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
