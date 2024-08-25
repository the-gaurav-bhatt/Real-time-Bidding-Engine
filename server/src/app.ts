import express from "express";
import { bidCreatorRouter } from "./routes/bids.controllers";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bidCreatorRouter);
export default app;
