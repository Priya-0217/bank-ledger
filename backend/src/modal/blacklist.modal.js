const mongoose = require("mongoose")

const tokenblacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { timestamps: true }
)

tokenblacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenblacklistSchema)

module.exports = TokenBlacklist
