const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BetHistorySchema = new Schema({
    amount: {
        type: Number,
        default:0.0
    },
    fee: {
        type: Number,
        default:0.0
    },
    total_red_amount: {
        type: Number,
        default:0.0
    },
    total_green_amount: {
        type: Number,
        default:0.0
    },
    wallet_key: {
        type: String
    },
    round_number: {
        type: Number,
        default:0.0
    },
    which: {
        type: String
    },
    trans_address: {
        type: String
    }
});

module.exports = BetHistory = mongoose.model("bet_history", BetHistorySchema);