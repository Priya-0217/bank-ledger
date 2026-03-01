const mongoose = require("mongoose")



const transactionalSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "account is required"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "account is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: [true, "type is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: [0.01, "amount must be greater than 0"],
    },
    idempotencyKey: {
      type: String,
      unique: true,
      index: true,
      required: [true, "idempotent key is required"],
    },
  },
  { timestamps: true }
)
const transactionalModel = mongoose.model("Transactional", transactionalSchema)
module.exports = transactionalModel
