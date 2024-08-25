import { io } from "socket.io-client";
export const socket = io("http://localhost:8000");
// export interface BidData {
//   creatorName: string;
//   title: string;
//   items: BidItem[];
//   startTime: string;
//   endTime: string;
// }
