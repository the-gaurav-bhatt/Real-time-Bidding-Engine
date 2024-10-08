"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_1 = require("./user");
const bidSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    items: [
        {
            item: { type: String, required: true },
            startingPrice: { type: Number, required: true },
            currentHighestBid: { type: Number },
            highestBidder: { type: String },
        },
    ],
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    bidders: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: user_1.user,
        required: false,
    },
    isPublished: { type: Boolean, default: false },
});
const Bid = (0, mongoose_1.model)("Bid", bidSchema);
exports.default = Bid;
