import { Request, Response, NextFunction } from "express";
import Bid from "../models/bid";
import { IUser, user } from "../models/user";
import { scheduleBitsStart } from "../utils/scheduleBitStart";
import { io } from "../server";
export const handleBidPublish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, startTime, endTime } = req.body;
    console.log(startTime, endTime);
    console.log(req.body);
    // Find the bid by ID and update startTime, endTime, and isPublished fields
    const updatedBid = await Bid.findByIdAndUpdate(
      _id,
      {
        $set: {
          startTime,
          endTime,
          isPublished: true, // Set bid as published
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedBid) {
      return res.status(404).json({ message: "Bid not found" });
    }
    scheduleBitsStart(updatedBid._id as string, startTime);
    // return res.status(404).json({ message: "Bid not found" });

    return res
      .status(200)
      .json({ message: "Bid published successfully", updatedBid });
  } catch (error) {
    console.error("Error publishing bid:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const handleBidderInvites = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const handleGetBidders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bidders = await user.find({ role: "Bidder" });
    return res.json(bidders);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong while getting the bidders.." });
  }
};
export const finalizeBid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  // const bidId = req.params.bidId
  // io.to(bidId).emit()
  return res.json(data);
  // console.log(req.body);
  // return res.json({ message: "Received" });
};
export const handleGetSingleBid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bidId = req.params.bidId;
  try {
    const bid = await Bid.findOne({ _id: bidId });
    // const bids = await Bid.find({ creator: us?._id });
    return res.json(bid);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong while getting the bidders.." });
  }
};

export const handleGetBids = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const usr = req.params.creator;
  try {
    const us = await user.findOne({ username: usr });
    const bids = await Bid.find({ creator: us?._id });
    return res.json(bids);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong while getting the bidders.." });
  }
};
export const handleGetAllBids = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bids = await Bid.find();
    return res.json(bids);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong while getting the bidders.." });
  }
};

export const handleCreateBidder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bidder = req.body.user;
  try {
    const bidd = await user.findOne({ username: bidder, role: "Bidder" });
    console.log(bidd);
    if (!bidd) {
      const usr = await user.create({
        username: bidder,
        role: "Bidder",
      });
      return res.json({ _id: usr._id });
    } else {
      return res.status(404).json({ message: "User Already exists" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ message: "Something went wront while creating the user" });
  }
};

export const handleCreateBid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, creator, items } = req.body;

    // Input validation
    if (!title || !creator || !items) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the creator user or create a new one
    let userId;
    const existingUser = await user.findOne({ username: creator });
    if (!existingUser) {
      const userBro: IUser = {
        username: creator,
        role: "BidCreator",
      };
      const newUser = await user.create(userBro);
      userId = newUser._id;
    } else {
      userId = existingUser._id;
    }

    // Create a new bid with the found/created userId
    const newBidData = {
      ...req.body,
      creator: userId,
    };
    const newBid = await Bid.create(newBidData);

    // Return the saved bid data in the response
    return res
      .status(201)
      .json({ message: "Bid created successfully", bidId: newBid._id });
  } catch (err) {
    console.log(err);

    // Handle errors during creation
    return res.status(500).json({ message: "Error creating bid", error: err });
  }
};
