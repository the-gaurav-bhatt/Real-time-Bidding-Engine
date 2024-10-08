"use client";
import { useState, useEffect } from "react";
import { socket } from "@/socket";
import { IBidItem } from "@/app/components/types/SocketEvents";
interface BidItem {
  _id: string;
  item: string;
  startingPrice: number;
  currentHighestBid: number;
  highestBidder: string;
}

interface Bid {
  _id: string;
  title: string;
  items: BidItem[];
  creator: string;
  startTime: Date;
  endTime: Date;
  bidders: string[];
  isPublished: boolean;
}

const calculateTimeRemaining = (endTime: string): string => {
  const currentTime = new Date();
  const end = new Date(endTime);
  const timeDiff = end.getTime() - currentTime.getTime(); // Difference in milliseconds

  if (timeDiff <= 0) return "Ended";

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const Page = ({ params }: { params: { bidId: string } }) => {
  const [bidId, setBidId] = useState(params.bidId);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [bid, setBid] = useState<Bid>();
  const [bidder, setBidder] = useState<string>();
  const [isFinalized, setIsFinalized] = useState<boolean>(false); // Track finalization
  const [showResults, setShowResults] = useState<boolean>(false); // Track whether to show results

  useEffect(() => {
    const bider = localStorage.getItem("bidder");
    if (bider) setBidder(bider);
    const fetchBid = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getBid/${bidId}`
      );
      const data = await res.json();
      setBid(data);
    };

    if (bidId) {
      fetchBid();
    }
  }, [bidId]);

  useEffect(() => {
    socket.on("bidUpdate", (x, itemId, amount, bidder) => {
      if (bidId === x) {
        setBid((prevBid: any) => {
          if (!prevBid) return null;

          const updatedItems = prevBid.items.map((item: IBidItem) => {
            if (item._id === itemId) {
              return {
                ...item,
                currentHighestBid: amount,
                highestBidder: bidder,
              };
            }
            return item;
          });

          return { ...prevBid, items: updatedItems };
        });
      }
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, [bidId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bid && !isFinalized) {
        const time = calculateTimeRemaining(bid.endTime.toString());
        setRemainingTime(time);

        if (time === "Ended") {
          finalizeBids();
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [bid, isFinalized]);

  const handleBid = async (itemId: string, amount: number) => {
    socket.emit("updateBidItem", bidId, itemId, amount, bidder);
  };

  const finalizeBids = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/finalizeBid/${bidId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bid }),
        }
      );

      if (response.ok) {
        console.log("Bids finalized successfully");
        setIsFinalized(true);
        setShowResults(true); // Show results after finalization
      } else {
        console.error("Failed to finalize bids");
      }
    } catch (error) {
      console.error("Error finalizing bids:", error);
    }
  };

  if (!bid) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4 mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
        {bid.title}
      </h1>

      {showResults ? (
        // Display the results
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
            Auction Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bid.items.map((item) => (
              <div
                key={item._id}
                className="bg-white text-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {item.item}
                </h2>
                <p className="text-gray-600 text-lg">
                  Final Price:{" "}
                  <span className="font-bold text-green-600">
                    ${item.currentHighestBid || item.startingPrice}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Winner:{" "}
                  <span className="font-bold text-blue-600">
                    {item.highestBidder || "No bids placed"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Display the bidding interface
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bid.items.map((item) => (
              <div
                key={item._id}
                className="bg-white text-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {item.item}
                </h2>
                <p className="text-gray-600 text-lg">
                  Current Price:{" "}
                  <span className="font-bold text-green-600">
                    ${item.currentHighestBid || item.startingPrice}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Top Ranker:{" "}
                  <span className="font-bold text-blue-600">
                    {item.highestBidder || "No bids yet"}
                  </span>
                </p>

                <div className="mt-4">
                  <input
                    type="number"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your bid"
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 w-full transition-background duration-300"
                    onClick={() => handleBid(item._id, price)}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-700">
            Remaining Time:{" "}
            <span className="font-bold text-red-500">{remainingTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
