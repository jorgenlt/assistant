import Conversation from "../models/Conversation.js";
import fetchOpenAiChatCompletion from "../services/fetchOpenAiChatCompletion.js";
import fetchAnthropicChatCompletion from "../services/fetchAnthropicChatCompletion.js";
import fetchMistralChatCompletion from "../services/fetchMistralChatCompletion.js";
import generateConversationTitle from "../utils/generateConversationTitle.js";
import { getApiKey } from "./userController.js";

// Build context from existing messages
const toContext = (messages) => {
  return messages.map((m) => ({ role: m.role, content: m.content }));
};

export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const conversation = await new Conversation({ userId }).save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id).lean();

    if (!conversation) return res.status(404).json({ error: "Not found" });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationsForUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversations = await Conversation.find({ userId }).lean();

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result = await Conversation.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Not found or not authorized" });
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { role, content, provider, model, currentId: id, userId } = req.body;

    if (!role || !content)
      return res.status(400).json({ error: "Role and content required" });

    // Push user message and update last activity
    const convo = await Conversation.findByIdAndUpdate(
      id,
      {
        $push: { messages: { role, content, created: new Date() } },
        lastMessageAt: new Date(),
      },
      { new: true }
    ).lean();

    // Build context from existing messages
    const context = toContext(convo.messages);

    // Fetch response from provider
    const fetchers = {
      openAi: fetchOpenAiChatCompletion,
      anthropic: fetchAnthropicChatCompletion,
      mistral: fetchMistralChatCompletion,
    };

    const apiKey = await getApiKey(userId, provider);

    const fetcher = fetchers[provider];

    if (!fetcher) {
      throw new Error("Unsupported chat completion provider: " + provider);
    }

    if (!apiKey) {
      throw new Error("API key missing: " + provider);
    }

    const response = await fetcher(context, apiKey, model);

    // Save assistant's reply
    await Conversation.findByIdAndUpdate(
      id,
      { $push: { messages: { ...response, created: new Date() } } },
      { new: true }
    );

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateTitle = async (req, res) => {
  try {
    const { id, prompt, userId } = req.body;

    if (!id || !prompt || !userId) {
      return res
        .status(400)
        .json({ error: "ID, prompt, and userId are required" });
    }

    const apiKey = await getApiKey(userId, "openAi");

    if (!apiKey) {
      throw new Error("API key missing for user: " + userId);
    }

    const generatedTitle = await generateConversationTitle(prompt, apiKey);

    const updated = await Conversation.findByIdAndUpdate(
      id,
      { title: generatedTitle },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
