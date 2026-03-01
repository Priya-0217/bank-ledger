const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "account id is required"],
      index: true,
      immutable: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transactional",
      required: [true, "transactional id is required"],
      index: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      immutable: true,
    },
      type: {
        type: String,
        enum:{
            values:["credit","debit"],
            message:"type can be either credit or debit"
        },
        required: [true, "type is required"],
        immutable: true,
      },

  },
 
)

function preventLedgerUpdate(ledger) {
    throw new Error("Ledger cannot be updated");
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerUpdate);
ledgerSchema.pre('updateOne',preventLedgerUpdate);
ledgerSchema.pre('deleteOne',preventLedgerUpdate);
ledgerSchema.pre('remove',preventLedgerUpdate);
ledgerSchema.pre('deleteMany',preventLedgerUpdate);
ledgerSchema.pre('updateMany',preventLedgerUpdate);
ledgerSchema.pre('findOneAndDelete',preventLedgerUpdate);
ledgerSchema.pre('findOneAndReplace',preventLedgerUpdate);


const ledgerModel = mongoose.model("Ledger", ledgerSchema)

module.exports = ledgerModel;
