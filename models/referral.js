const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReferralSchema = new Schema({
    publicKey: {
      type: String
    },
    amount: {
      type: Number,
      default: 0
    }
});
  
module.exports = Referral = mongoose.model("referral", ReferralSchema);