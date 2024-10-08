import http from "http";
import app from "./app";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import mongoose, { MongooseError } from "mongoose";
import Bid from "./models/bid";
import { user } from "./models/user";
export const server = http.createServer(app);
const URI = process.env.URI;
// use urlencoded while working with forms and not json
console.log(URI);
const PORT = process.env.PORT || 8000;

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://real-time-bidding-engine.vercel.app",
      "https://real-time-bidding-engine-thegauravbhatts-projects.vercel.app",
      "https://real-time-bidding-engine-git-main-thegauravbhatts-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

interface IInvite {
  bitId: string;
  invitedUserSocketId: string;
  invitingUser: string;
}

interface BidItem {
  name: string;
  description: string;
  startingPrice: number;
}

interface BidData {
  creatorName: string;
  title: string;
  items: BidItem[];
  startTime: string;
  endTime: string;
}
io.on("connection", (socket) => {
  console.log(`A user connected with id ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
  });
  // this will create a room with bitId
  socket.on("connectBidding", async (bidId, userId) => {
    console.log(bidId, userId);
    try {
      console.log(`Joining the room ${bidId}...`);
      socket.join(bidId);

      // Update the user document
      await user.findByIdAndUpdate(userId, {
        $push: {
          bids: bidId,
        },
      });

      // Update the bid document
      await Bid.findByIdAndUpdate(bidId, {
        $push: {
          bidders: userId,
        },
      });

      console.log(`User ${userId} joined bid ${bidId} successfully.`);
    } catch (error) {
      console.log(`Error connecting user to bid: ${error}`);
    }
  });
  socket.on("updateBidItem", (bidId, itemId, price, bidder) => {
    console.log("Logging Things" + bidId, itemId, price, bidder);
    io.to(bidId).emit("bidUpdate", bidId, itemId, price, bidder);
  });
  socket.on("finalizedItem", (bidId, bid) => {
    // console.log("Logging Things" + bidId, itemId, price, bidder);
    io.to(bidId).emit("finalItems", bidId, bid);
  });
  socket.on("connectToUser", (user) => {
    console.log("User connected for reacting room of his onw id ");
    console.log(user.userId);
    socket.join(user.userId);
  });

  // this will send invites to the user to join Bidding event in a room that has bidId as roomId
  socket.on("inviteEvent", (invite: IInvite) => {
    console.log(invite);
    // this will send the user having _id(assumed as socket id) and that user can listen in socket.in(userId).on()
    io.to(invite.invitedUserSocketId).emit("invitation", invite);
    console.log(
      "sending invitation to " + invite.invitedUserSocketId + " Success...."
    );
  });
});

const startServer = async () => {
  if (URI) {
    mongoose
      .connect(URI)
      .then(() => {
        server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      })
      .catch((err: MongooseError) => {
        console.log(err);
      });
  } else console.log("Missing URI for MongoDB");
};

startServer();
