import User from "../models/User.js";

export const hasApiKeyForProvider = async (userId, provider) => {
  if (!userId) throw new Error("userId is invalid");
  if (!provider) throw new Error("provider is invalid");

  const user = await User.findById(userId);

  if (!user) return false;

  return Boolean(user.apiKeys[provider]);
};
