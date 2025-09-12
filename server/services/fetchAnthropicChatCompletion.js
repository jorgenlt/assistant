import Anthropic from "@anthropic-ai/sdk";
import systemPrompt from "./systemPrompt.js";

async function fetchAnthropicChatCompletion(context, apiKey, model) {
  try {
    const anthropic = new Anthropic({
      apiKey,
    });

    const chatResponse = await anthropic.messages.create({
      model,
      max_tokens: 3500,
      system: systemPrompt,
      messages: context,
    });

    const role = chatResponse.role;

    const content = chatResponse.content[0].text;

    return {
      role,
      content,
    };
  } catch (error) {
    console.error(
      "Error in fetchAnthropicChatCompletion:",
      error.message || error.response.data.error?.message
    );
    throw error;
  }
}

export default fetchAnthropicChatCompletion;
