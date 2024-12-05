import express from "express";
import { bidCreatorRouter } from "./routes/bids.controllers";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "https://real-time-bidding-engine-b8a0.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bidCreatorRouter);
export default app;
