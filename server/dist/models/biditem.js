"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bidItemSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    bid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Bid",
    },
});
const BidItem = (0, mongoose_1.model)("BidItem", bidItemSchema);
exports.default = BidItem;
