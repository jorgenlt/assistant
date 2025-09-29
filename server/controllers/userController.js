import User from "../models/User.js";
import { encryptKey } from "../utils/crypto.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    // Remove the user password before sending a response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json(userObj);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider, key } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }

    if (!provider || !key) {
      return res
        .status(400)
        .json({ message: "Provider and api key are required" });
    }

    const encryptedKey = encryptKey(key);

    const update = {
      [`apiKeys.${provider}`]: encryptedKey,
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `API key for ${provider} encrypted and saved in the database.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
