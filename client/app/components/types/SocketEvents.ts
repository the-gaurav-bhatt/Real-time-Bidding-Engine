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
export interface IBidItem {
  _id?: string;
  item: string;
  startingPrice: number;
}

export interface IBid {
  _id: string;
  title: string;
  items: IBidItem[];
  creator: {
    username: string;
  };
  startTime: string;
  bidders: [string];
  endTime: string;
  isPublished: boolean;
}
