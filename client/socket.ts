import { io } from "socket.io-client";
export const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
// export interface BidData {
//   creatorName: string;
//   title: string;
//   items: BidItem[];
//   startTime: string;
//   endTime: string;
// }
