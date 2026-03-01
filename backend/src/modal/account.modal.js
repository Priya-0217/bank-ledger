const moongoose = require("mongoose")
const ledgerModel = require("./ledger.modal")
const accountSchema = new moongoose.Schema(
  {
    user: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
      index: true,
    },

    currency: {
      type: String,
      default: "USD",
      required: [true, "currency is required"],
    },

    status: {
      type: String,
      enum: {
        values: ["active", "closed", "frozen"],
        message: " status is{VALUE} ",
      },
      default: "active",
    },
  },
  { timestamps: true }
)
accountSchema.index({user:1,status:1})

accountSchema.methods.getBalancedata = async function(){
    const balance = await ledgerModel.aggregate([
        {
            $match:{
                account:this._id
            }
        },
        {
            $group:{
                _id:null,
                totaldebit:{
                  $sum:{
                    $cond:{
                        if:{$eq:["$type","debit"]},
                        then:"$amount",
                        else:0
                    }
                  }
                },
                totalcredit:{
                  $sum:{
                    $cond:{
                        if:{$eq:["$type","credit"]},
                        then:"$amount",
                        else:0
                    }
                  }
                }

            }
        },
        {
            $project:{
                _id:0,
                balance:{$subtract:["$totalcredit","$totaldebit"]}
            }
        }
    ])
   
    if(balance.length === 0){
        return 0
    }
    return balance[0].balance
}






const AccountModel = moongoose.model("Account",accountSchema)
module.exports = AccountModel
