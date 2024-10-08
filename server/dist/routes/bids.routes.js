"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateBid = exports.handleCreateBidder = exports.handleGetAllBids = exports.handleGetBids = exports.handleGetSingleBid = exports.finalizeBid = exports.handleGetBidders = exports.handleBidderInvites = exports.handleBidPublish = void 0;
const bid_1 = __importDefault(require("../models/bid"));
const user_1 = require("../models/user");
const scheduleBitStart_1 = require("../utils/scheduleBitStart");
const handleBidPublish = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, startTime, endTime } = req.body;
        console.log(startTime, endTime);
        console.log(req.body);
        // Find the bid by ID and update startTime, endTime, and isPublished fields
        const updatedBid = yield bid_1.default.findByIdAndUpdate(_id, {
            $set: {
                startTime,
                endTime,
                isPublished: true, // Set bid as published
            },
        }, { new: true } // Return the updated document
        );
        if (!updatedBid) {
            return res.status(404).json({ message: "Bid not found" });
        }
        (0, scheduleBitStart_1.scheduleBitsStart)(updatedBid._id, startTime);
        // return res.status(404).json({ message: "Bid not found" });
        return res
            .status(200)
            .json({ message: "Bid published successfully", updatedBid });
    }
    catch (error) {
        console.error("Error publishing bid:", error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.handleBidPublish = handleBidPublish;
const handleBidderInvites = (req, res, next) => { };
exports.handleBidderInvites = handleBidderInvites;
const handleGetBidders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bidders = yield user_1.user.find({ role: "Bidder" });
        return res.json(bidders);
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong while getting the bidders.." });
    }
});
exports.handleGetBidders = handleGetBidders;
const finalizeBid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // const bidId = req.params.bidId
    // io.to(bidId).emit()
    return res.json(data);
    // console.log(req.body);
    // return res.json({ message: "Received" });
});
exports.finalizeBid = finalizeBid;
const handleGetSingleBid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bidId = req.params.bidId;
    try {
        const bid = yield bid_1.default.findOne({ _id: bidId });
        // const bids = await Bid.find({ creator: us?._id });
        return res.json(bid);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Something went wrong while getting the bidders.." });
    }
});
exports.handleGetSingleBid = handleGetSingleBid;
const handleGetBids = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const usr = req.params.creator;
    try {
        const us = yield user_1.user.findOne({ username: usr });
        const bids = yield bid_1.default.find({ creator: us === null || us === void 0 ? void 0 : us._id });
        return res.json(bids);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Something went wrong while getting the bidders.." });
    }
});
exports.handleGetBids = handleGetBids;
const handleGetAllBids = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bids = yield bid_1.default.find();
        return res.json(bids);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Something went wrong while getting the bidders.." });
    }
});
exports.handleGetAllBids = handleGetAllBids;
const handleCreateBidder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bidder = req.body.user;
    try {
        const bidd = yield user_1.user.findOne({ username: bidder, role: "Bidder" });
        console.log(bidd);
        if (!bidd) {
            const usr = yield user_1.user.create({
                username: bidder,
                role: "Bidder",
            });
            return res.json({ _id: usr._id });
        }
        else {
            return res.status(404).json({ message: "User Already exists" });
        }
    }
    catch (err) {
        console.log(err);
        return res
            .status(404)
            .json({ message: "Something went wront while creating the user" });
    }
});
exports.handleCreateBidder = handleCreateBidder;
const handleCreateBid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, creator, items } = req.body;
        // Input validation
        if (!title || !creator || !items) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Find the creator user or create a new one
        let userId;
        const existingUser = yield user_1.user.findOne({ username: creator });
        if (!existingUser) {
            const userBro = {
                username: creator,
                role: "BidCreator",
            };
            const newUser = yield user_1.user.create(userBro);
            userId = newUser._id;
        }
        else {
            userId = existingUser._id;
        }
        // Create a new bid with the found/created userId
        const newBidData = Object.assign(Object.assign({}, req.body), { creator: userId });
        const newBid = yield bid_1.default.create(newBidData);
        // Return the saved bid data in the response
        return res
            .status(201)
            .json({ message: "Bid created successfully", bidId: newBid._id });
    }
    catch (err) {
        console.log(err);
        // Handle errors during creation
        return res.status(500).json({ message: "Error creating bid", error: err });
    }
});
exports.handleCreateBid = handleCreateBid;
