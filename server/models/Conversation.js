import mongoose from "mongoose";
const { Schema } = mongoose;

// Subdocument schema for a single message
const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: { type: String, required: true },
    created: { type: Date, default: Date.now },
  },
);

// Main Conversation schema
const ConversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // optional if you have user auth
    title: { type: String, default: null },
    messages: { type: [MessageSchema], default: [] },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;
