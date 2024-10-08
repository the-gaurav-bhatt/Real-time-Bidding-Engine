"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleBitsStart = void 0;
const server_1 = require("../server");
const scheduleBitsStart = (bidId, startDate) => {
    const currentTime = new Date().getTime();
    const timeUntilStart = new Date(startDate).getTime() - currentTime;
    console.log(timeUntilStart);
    if (timeUntilStart > 0) {
        // Schedule the bid start
        setTimeout(() => {
            server_1.io.to(bidId).emit("bid-started", { bidId }); // Emit event to the specific bid room
            console.log(`Bid with ID ${bidId} has started`);
        }, timeUntilStart);
    }
    else {
        // If start time has already passed, start immediately
        server_1.io.to(bidId).emit("bid-started", { bidId });
        console.log(`Bid with ID ${bidId} has already started`);
    }
};
exports.scheduleBitsStart = scheduleBitsStart;
