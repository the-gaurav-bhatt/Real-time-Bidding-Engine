"use client";

import React, { useEffect, useState, useCallback } from "react";
import { socket } from "@/socket";
import Link from "next/link";
import { IBid } from "../components/types/SocketEvents";
const BidderDashboard: React.FC = () => {
  const [bids, setBids] = useState<IBid[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [bidderId, setBidderId] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);

  // Function to fetch bids
  const fetchBids = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getAllBids`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bids");
      }
      const data: IBid[] = await response.json();
      setBids(data);
    } catch (error) {
      console.error("Failed to fetch bids:", error);
    }
  }, []);

  // Function to handle user setup
  const setupUser = useCallback(() => {
    const storedUser = localStorage.getItem("bidder");
    const storedBidderId = localStorage.getItem("bidderId");

    if (storedUser && storedBidderId) {
      setUser(storedUser);
      setBidderId(storedBidderId);
      setCreated(true);
      socket.emit("connectToUser", { userId: storedBidderId });
    }
  }, []);

  // Function to handle incoming invitations
  const handleInvitation = useCallback(
    (message: any, room: any) => {
      console.log("Received invitation:", message, "in room:", room);
      if (message.invitedUserSocketId === bidderId) {
        setInvitations((prevInvitations) => [...prevInvitations, message]);
      }
    },
    [bidderId]
  );

  // useEffect for initial setup and socket handling
  useEffect(() => {
    setupUser();
    fetchBids();

    socket.on("invitation", handleInvitation);

    return () => {
      socket.off("invitation", handleInvitation);
    };
  }, [fetchBids, setupUser, handleInvitation]);

  // Countdown logic to calculate the remaining time
  const calculateTimeRemaining = (startTime: string): string => {
    const currentTime = new Date();
    const start = new Date(startTime);
    const timeDiff = start.getTime() - currentTime.getTime();

    if (timeDiff <= 0) return "Started";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // useEffect for triggering the countdown update
  useEffect(() => {
    const interval = setInterval(() => {
      setBids((prevBids) => [...prevBids]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/createBidder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        }
      );
      if (!res.ok) {
        setCreated(false);
        throw new Error("Failed to create user");
      }
      const data = await res.json();
      setCreated(true);
      setBidderId(data._id);
      localStorage.setItem("bidder", user as string);
      localStorage.setItem("bidderId", data._id);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleAcceptInvitation = (bidId: string) => {
    console.log("Accepted invitation for bid:", bidId);
    socket.emit("connectBidding", bidId, bidderId);
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invitation) => invitation.bidId !== bidId)
    );
  };

  const handleRejectInvitation = (bidId: string) => {
    console.log("Rejected invitation for bid:", bidId);
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invitation) => invitation.bidId !== bidId)
    );
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
                  className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectInvitation(invitation.bidId)}
                  className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-4xl mx-auto shadow-md rounded-lg p-6">
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
                      <Link href={`/ongoing-bids/${bid._id}`}>{bid.title}</Link>
                    </h3>
                  </div>
                  <div>
                    <button
                      onClick={() => handleAcceptInvitation(bid._id)}
                      className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition"
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
