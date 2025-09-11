import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  // Message identification
  messageId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },

  // Conversation/Chat reference
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },

  // User reference (optional for anonymous chats)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },

  // Message content
  content: {
    type: String,
    required: true,
    maxlength: 10000 // Adjust based on your needs
  },

  // Message role: 'user', 'assistant', 'system'
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant', 'system'],
    index: true
  },

  // Message metadata
  metadata: {
    // Token usage for AI responses
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 }
    },

    // AI model information
    model: {
      type: String,
      required: function() {
        return this.role === 'assistant';
      }
    },

    // Response time for assistant messages
    responseTime: {
      type: Number, // milliseconds
      required: function() {
        return this.role === 'assistant';
      }
    },

    // Temperature and other AI parameters
    aiParameters: {
      temperature: { type: Number, min: 0, max: 2 },
      maxTokens: { type: Number },
      topP: { type: Number, min: 0, max: 1 }
    }
  },

  // Message status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },

  // Error information (if message failed)
  error: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed
  },

  // Message ordering within conversation
  sequenceNumber: {
    type: Number,
    required: true,
    index: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
messageSchema.index({ conversationId: 1, sequenceNumber: 1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ role: 1, status: 1 });

// Pre-save middleware to update sequenceNumber
messageSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastMessage = await this.constructor
      .findOne({ conversationId: this.conversationId })
      .sort({ sequenceNumber: -1 });
    
    this.sequenceNumber = lastMessage ? lastMessage.sequenceNumber + 1 : 1;
  }
  
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted timestamp
messageSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toISOString();
});

// Instance methods
messageSchema.methods.markAsDeleted = function() {
  this.isDeleted = true;
  this.updatedAt = new Date();
  return this.save();
};

messageSchema.methods.updateContent = function(newContent) {
  this.content = newContent;
  this.updatedAt = new Date();
  return this.save();
};

// Static methods
messageSchema.statics.getConversationMessages = function(conversationId, limit = 50, skip = 0) {
  return this.find({ 
    conversationId, 
    isDeleted: false 
  })
  .sort({ sequenceNumber: 1 })
  .limit(limit)
  .skip(skip)
  .populate('userId', 'username email');
};

messageSchema.statics.getLastUserMessage = function(conversationId) {
  return this.findOne({
    conversationId,
    role: 'user',
    isDeleted: false
  }).sort({ createdAt: -1 });
};

const Message = mongoose.model('Message', messageSchema);

export default Message;