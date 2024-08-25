// app/bidder-dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/socket";
import Link from "next/link";
// types/bid.ts

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

const BidderDashboard: React.FC = () => {
  const [bids, setBids] = useState<IBid[]>([]);
  const [user, setUser] = useState("");
  const [bidderId, setBidderId] = useState("");
  const [created, setCreated] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);

  // Fetch bids from the backend
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch("http://localhost:8000/getAllBids");
        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }

        const data: IBid[] = await response.json(); // Type the response data as IBid[]
        setBids(data); // Set bids data
      } catch (error) {
        console.error("Failed to fetch bids:", error);
      }
    };
    const x = localStorage.getItem("bidder");
    const y = localStorage.getItem("bidderId");
    if (x && y) {
      setUser(x);
      setBidderId(y);
      setCreated(true);
    }
    fetchBids();
    socket.emit("connectToUser", { userId: bidderId });
    socket.on("invitation", (message, room) => {
      console.log(room);
      console.log(message);
      console.log("Inside invitation function");
      if (message.invitedUserSocketId === bidderId) {
        console.log("Invitation receiving successfully", message);
        setInvitations((prevInvitations) => [...prevInvitations, message]);
      }
    });
  }, [bidderId]);

  const handleAcceptInvitation = (bidId: string) => {
    // Implement logic to accept the invitation (e.g., navigate to the bid page)
    console.log("Accepted invitation for bid:", bidId);
    // ... (your acceptance logic)
    socket.emit("connectBidding", bidId, bidderId);
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invitation) => invitation.bidId !== bidId)
    );
  };

  const handleRejectInvitation = (bidId: string) => {
    // Implement logic to reject the invitation (e.g., send a rejection message to the server)
    console.log("Rejected invitation for bid:", bidId);
    // ... (your rejection logic)
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invitation) => invitation.bidId !== bidId)
    );
  };

  // Calculate the remaining time until the bid starts
  const calculateTimeRemaining = (startTime: string): string => {
    const currentTime = new Date();
    const start = new Date(startTime);
    const timeDiff = start.getTime() - currentTime.getTime(); // Difference in milliseconds

    if (timeDiff <= 0) return "Started";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Start the countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setBids((prevBids) => [...prevBids]); // Trigger re-render every second
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/createBidder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user }),
      });
      if (!res.ok) {
        setCreated(false);
      } else {
        const data = await res.json();
        setCreated(true);
        setBidderId(data._id);
        localStorage.setItem("bidder", user);
        localStorage.setItem("bidderId", data._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        {`Welcome to the Bidding Platform ${user ? user : ""}`}
      </h1>
      {!created && (
        <div>
          <h1 className="text-2xl font-bold text-center mb-8 text-green-700">
            Enter a valid username:
          </h1>
          <input
            name="username"
            id=""
            onChange={(e) => setUser(e.target.value)}
            className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          />
          <button
            onClick={handleCreateUser}
            className="bg-green-500 hover:bg-green-700  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Username
          </button>
        </div>
      )}
      {/* Display invitations */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          Invitations
        </h2>
        <ul className="space-y-4 text-black">
          {invitations.map((invitation) => (
            <li
              key={invitation.bidId}
              className="p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition"
            >
              <p>You have been invited to bid on: {invitation.bidId}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleAcceptInvitation(invitation.bidId)}
                  className="bg-green-500  px-4 py-2 rounded-md hover:bg-green-600 transition mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectInvitation(invitation.bidId)}
                  className="bg-red-500  px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-4xl mx-auto  shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-amber-700">
          Available Bids
        </h2>
        <ul className="space-y-4">
          {bids.length > 0 ? (
            bids.map((bid) => (
              <li
                key={bid._id}
                className="p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      <Link href={`/ongoing-bids/${bid._id}`}>{bid.title}</Link>{" "}
                    </h3>
                  </div>
                  <div>
                    <button
                      onClick={() => handleAcceptInvitation(bid._id)}
                      className="bg-green-500  px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                      Accept Bid
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-black">
                  <h4 className="text-lg font-semibold">Items:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {bid.items.map((item, index) => (
                      <li key={index}>
                        {item.item}: Starting Price - ${item.startingPrice}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 text-sm text-black">
                  <p>Start Time: {new Date(bid.startTime).toLocaleString()}</p>
                  <p>End Time: {new Date(bid.endTime).toLocaleString()}</p>
                  <p className="text-red-500">
                    Time Remaining: {calculateTimeRemaining(bid.startTime)}
                  </p>
                </div>
                {/* Check if the current bidder has accepted the bid */}
                {bid.bidders.some(
                  (bidderIdInBid) => bidderIdInBid === bidderId
                ) ? (
                  <p className="text-green-500">Accepted</p>
                ) : (
                  <p className="text-red-500">Not Accepted</p>
                )}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No bids available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BidderDashboard;
