import { Router } from "express";
export const bidCreatorRouter = Router();
import {
  handleBidderInvites,
  handleBidPublish,
  handleCreateBid,
  handleGetBids,
  handleGetBidders,
  handleGetAllBids,
  handleCreateBidder,
  handleGetSingleBid,
  finalizeBid,
} from "./bids.routes";

bidCreatorRouter.get("/get-bids/:creator", handleGetBids);
bidCreatorRouter.get("/getAllBids", handleGetAllBids);
bidCreatorRouter.get("/bidders", handleGetBidders);
bidCreatorRouter.get("/getBid/:bidId", handleGetSingleBid);
bidCreatorRouter.post("/finalizeBid/:bidId", finalizeBid);

bidCreatorRouter.post("/create-bid", handleCreateBid);
bidCreatorRouter.post("/createBidder", handleCreateBidder);
bidCreatorRouter.post("/invite-bidders", handleBidderInvites);
bidCreatorRouter.post("/publish-bid", handleBidPublish);
