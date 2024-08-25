export interface CreateBid {
  title: string;
  items: { description: string }[];
  startTime: Date;
  endTime: Date;
}

export interface BidItem {
  itemId: string;
  amount: number;
}
