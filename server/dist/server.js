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
exports.io = exports.server = void 0;
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const bid_1 = __importDefault(require("./models/bid"));
const user_1 = require("./models/user");
exports.server = http_1.default.createServer(app_1.default);
const URI = process.env.URI;
// use urlencoded while working with forms and not json
console.log(URI);
const PORT = process.env.PORT || 8000;
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: 
        // "http://localhost:3000",
        "https://real-time-bidding-engine.vercel.app/",
        // "https://real-time-bidding-engine-thegauravbhatts-projects.vercel.app/",
        // "https://real-time-bidding-engine-git-main-thegauravbhatts-projects.vercel.app/",
        methods: ["GET", "POST"],
    },
});
exports.io.on("connection", (socket) => {
    console.log(`A user connected with id ${socket.id}`);
    socket.on("disconnect", (reason) => {
        console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    });
    // this will create a room with bitId
    socket.on("connectBidding", (bidId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(bidId, userId);
        try {
            console.log(`Joining the room ${bidId}...`);
            socket.join(bidId);
            // Update the user document
            yield user_1.user.findByIdAndUpdate(userId, {
                $push: {
                    bids: bidId,
                },
            });
            // Update the bid document
            yield bid_1.default.findByIdAndUpdate(bidId, {
                $push: {
                    bidders: userId,
                },
            });
            console.log(`User ${userId} joined bid ${bidId} successfully.`);
        }
        catch (error) {
            console.log(`Error connecting user to bid: ${error}`);
        }
    }));
    socket.on("updateBidItem", (bidId, itemId, price, bidder) => {
        console.log("Logging Things" + bidId, itemId, price, bidder);
        exports.io.to(bidId).emit("bidUpdate", bidId, itemId, price, bidder);
    });
    socket.on("finalizedItem", (bidId, bid) => {
        // console.log("Logging Things" + bidId, itemId, price, bidder);
        exports.io.to(bidId).emit("finalItems", bidId, bid);
    });
    socket.on("connectToUser", (user) => {
        console.log("User connected for reacting room of his onw id ");
        console.log(user.userId);
        socket.join(user.userId);
    });
    // this will send invites to the user to join Bidding event in a room that has bidId as roomId
    socket.on("inviteEvent", (invite) => {
        console.log(invite);
        // this will send the user having _id(assumed as socket id) and that user can listen in socket.in(userId).on()
        exports.io.to(invite.invitedUserSocketId).emit("invitation", invite);
        console.log("sending invitation to " + invite.invitedUserSocketId + " Success....");
    });
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (URI) {
        mongoose_1.default
            .connect(URI)
            .then(() => {
            exports.server.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
            .catch((err) => {
            console.log(err);
        });
    }
    else
        console.log("Missing URI for MongoDB");
});
startServer();
