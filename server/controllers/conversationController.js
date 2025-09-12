import Conversation from "../models/Conversation.js";
import wrapAsync from "../utils/wrapAsync.js";
import fetchOpenAiChatCompletion from "../services/fetchOpenAiChatCompletion.js";
import generateConversationTitle from "../utils/generateConversationTitle.js";
import { getApiKey } from "./userController.js";

// Build context from existing messages
const toContext = (messages) => {
  return messages.map((m) => ({ role: m.role, content: m.content }));
};

export const createConversation = wrapAsync(async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId is required" });

  const convo = await new Conversation({ userId }).save();

  res.status(201).json(convo);
});

export const getConversation = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const convo = await Conversation.findById(id).lean();

  if (!convo) return res.status(404).json({ error: "Not found" });

  res.json(convo);
});

// Get all conversations for the authenticated user
export const getConversationsForUser = wrapAsync(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const conversations = await Conversation.find({ userId }).lean();

  res.json({ conversations });
});

export const deleteConversation = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(req.params)
  console.log(req.body)
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const result = await Conversation.deleteOne({ _id: id, userId });

  if (result.deletedCount === 0) {
    // Not found or not owned by this user
    return res.status(404).json({ error: "Not found or not authorized" });
  }

  res.status(200).json({ id });
});

export const addMessage = wrapAsync(async (req, res) => {
  const { role, content, provider, currentId: id, userId } = req.body;
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
    // anthropic: fetchAnthropicChatCompletion,
    // mistral: fetchMistralChatCompletion,
  };

  const apiKey = await getApiKey(userId, provider);

  const fetcher = fetchers[provider];

  if (!fetcher) {
    throw new Error("Unsupported chat completion provider: " + provider);
  }
  if (!apiKey) {
    throw new Error("API key missing: " + provider);
  }

  const response = await fetcher(context, content, apiKey);

  // Save assistant's reply
  await Conversation.findByIdAndUpdate(
    id,
    { $push: { messages: { ...response, created: new Date() } } },
    { new: true }
  );

  res.json({ response });
});

export const updateTitle = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const convo = await Conversation.findByIdAndUpdate(
    id,
    { title },
    { new: true }
  ).lean();
  if (!convo) return res.status(404).json({ error: "Not found" });

  res.json(convo);
});

export const generateTitle = wrapAsync(async (req, res) => {
  const { id, prompt, userId } = req.body;

  const apiKey = await getApiKey(userId, "openAi");

  const generatedTitle = await generateConversationTitle(prompt, apiKey);

  const updated = await Conversation.findByIdAndUpdate(
    id,
    { title: generatedTitle },
    { new: true }
  ).lean();

  res.json(updated);
});
