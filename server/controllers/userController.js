import User from "../models/User.js";
import { encryptKey, decryptKey } from "../utils/crypto.js";

// Get a specific user based on ID
export const getUser = async (req, res) => {
  try {
    // Extracting the user ID from the request parameters
    const { id } = req.params;

    // Finding the user in the database using the extracted ID
    const user = await User.findById(id);

    // Remove the user password before sending a response
    const userObj = user.toObject(); // Convert to plain js object
    delete userObj.password;

    // Sending a successful response with the found user
    res.status(200).json(userObj);
  } catch (err) {
    // Sending an error response when unable to find the user
    res.status(404).json({ message: err.message });
  }
};

export const addApiKey = async (req, res) => {
  console.log("hello from addApiKey")
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

    res.status(200).json({ message: `API key for ${provider} encrypted and saved in the database.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
