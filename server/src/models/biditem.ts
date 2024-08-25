import { Schema, model, Document, Types } from "mongoose";

interface IBidItem extends Document {
  description: string;
  startingPrice: number;
  bid: Types.ObjectId;
}

const bidItemSchema = new Schema<IBidItem>({
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  bid: {
    type: Schema.Types.ObjectId,
    ref: "Bid",
  },
});

const BidItem = model<IBidItem>("BidItem", bidItemSchema);
export default BidItem;
