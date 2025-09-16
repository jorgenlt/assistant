import { decryptKey } from "../utils/crypto.js";
import User from "../models/User.js";

export const getDecryptedApiKey = async (userId, provider) => {
  try {
    if (!userId || !provider) {
      throw new Error("userId or provider is invalid");
    }

    const user = await User.findById(userId);
    const key = user.apiKeys[provider];
    const decryptedKey = decryptKey(key);

    return decryptedKey;
  } catch (error) {
    throw new Error(`Cannot get API key for ${provider}.`, error.message);
  }
};
