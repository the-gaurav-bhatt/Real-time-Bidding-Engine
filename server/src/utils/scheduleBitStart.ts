import { io } from "../server";
export const scheduleBitsStart = (bidId: string, startDate: string) => {
  const currentTime = new Date().getTime();
  const timeUntilStart = new Date(startDate).getTime() - currentTime;
  console.log(timeUntilStart);
  if (timeUntilStart > 0) {
    // Schedule the bid start
    setTimeout(() => {
      io.to(bidId).emit("bid-started", { bidId }); // Emit event to the specific bid room
      console.log(`Bid with ID ${bidId} has started`);
    }, timeUntilStart);
  } else {
    // If start time has already passed, start immediately
    io.to(bidId).emit("bid-started", { bidId });
    console.log(`Bid with ID ${bidId} has already started`);
  }
};
