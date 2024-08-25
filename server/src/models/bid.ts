import { Schema, model, Document, Types } from "mongoose";
import { user } from "./user";

export interface IBid extends Document {
  title: string;
  items: [
    {
      item: string;
      startingPrice: number;
      currentHighestBid?: number; // New field to track highest bid
      highestBidder?: string; // New field to track highest bidder
    }
  ];
  creator: Types.ObjectId;
  bidders?: [Types.ObjectId];
  startTime: Date;
  endTime: Date;
  isPublished: boolean;
}

const bidSchema = new Schema<IBid>({
  title: { type: String, required: true },
  items: [
    {
      item: { type: String, required: true },
      startingPrice: { type: Number, required: true },
      currentHighestBid: { type: Number },
      highestBidder: { type: String },
    },
  ],
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: false },
  endTime: { type: Date, required: false },
  bidders: {
    type: [Schema.Types.ObjectId],
    ref: user,
    required: false,
  },
  isPublished: { type: Boolean, default: false },
});

const Bid = model<IBid>("Bid", bidSchema);
export default Bid;
