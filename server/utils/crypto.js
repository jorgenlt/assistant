import crypto from "crypto";

export const encryptKey = (key) => {
  const secret = process.env.API_KEY_SECRET;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(secret, "hex"),
    iv
  );

  let encrypted = cipher.update(key, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

export const decryptKey = (data) => {
  const [ivHex, authTagHex, encrypted] = data.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.API_KEY_SECRET, "hex"),
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
