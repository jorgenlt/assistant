import OpenAI from "openai";
import systemPrompt from "./systemPrompt.js";

const fetchOpenAiChatCompletion = async (
  context,
  prompt,
  apiKey,
  model = "gpt-5-nano"
) => {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: false });
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...context,
      { role: "user", content: prompt },
    ],
  });

  const { role, content } = response.choices[0].message;
  return { role, content };
};

export default fetchOpenAiChatCompletion;
