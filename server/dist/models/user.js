"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    bids: {
        type: [mongoose_1.Schema.Types.ObjectId],
        // ref: Bid,
        required: false,
    },
    role: { type: String, required: true, enum: ["BidCreator", "Bidder"] },
    // password: { type: String, required: true },
});
exports.user = (0, mongoose_1.model)("User", userSchema);
