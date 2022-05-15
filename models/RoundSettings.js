const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RoundSettings = new Schema({
    idnum: {
        type: Number,
        default:0
    },
    round_times: {
        type: Number,
        default: 0
    },
    jackpot: {
        type: Number,
        default:0.0
    },
    min_fee: {
        type: Number,
        default:0.0
    },
    max_fee: {
        type: Number,
        default:0.0
    },
    min_bet: {
        type: Number,
        default:0.0
    },
    max_bet: {
        type: Number,
        default:0.0
    },
    checked: {
        type: Boolean,
        default:true
    },
});

module.exports = RoundSet = mongoose.model("round_settings", RoundSettings);