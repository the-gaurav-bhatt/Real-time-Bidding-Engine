"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidCreatorRouter = void 0;
const express_1 = require("express");
exports.bidCreatorRouter = (0, express_1.Router)();
const bids_routes_1 = require("./bids.routes");
exports.bidCreatorRouter.get("/get-bids/:creator", bids_routes_1.handleGetBids);
exports.bidCreatorRouter.get("/getAllBids", bids_routes_1.handleGetAllBids);
exports.bidCreatorRouter.get("/bidders", bids_routes_1.handleGetBidders);
exports.bidCreatorRouter.get("/getBid/:bidId", bids_routes_1.handleGetSingleBid);
exports.bidCreatorRouter.post("/finalizeBid/:bidId", bids_routes_1.finalizeBid);
exports.bidCreatorRouter.post("/create-bid", bids_routes_1.handleCreateBid);
exports.bidCreatorRouter.post("/createBidder", bids_routes_1.handleCreateBidder);
exports.bidCreatorRouter.post("/invite-bidders", bids_routes_1.handleBidderInvites);
exports.bidCreatorRouter.post("/publish-bid", bids_routes_1.handleBidPublish);
