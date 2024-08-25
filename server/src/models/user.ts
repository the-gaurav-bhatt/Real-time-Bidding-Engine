import { Schema, model, InferSchemaType } from "mongoose";
import Bid from "./bid";
const userSchema = new Schema({
  username: { type: String, required: true },
  // email: { type: String, required: true, unique: true },
  bids: {
    type: [Schema.Types.ObjectId],
    // ref: Bid,
    required: false,
  },
  role: { type: String, required: true, enum: ["BidCreator", "Bidder"] },
  // password: { type: String, required: true },
});
export type IUser = InferSchemaType<typeof userSchema>;
export const user = model<IUser>("User", userSchema);
