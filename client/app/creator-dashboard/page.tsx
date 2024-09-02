"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Type definitions for bids and user
interface Bid {
  _id: string;
  title: string;
  creator: string;
  startTime: string;
  endTime: string;
  isPublished: boolean;
}

export default function Dashboard() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const creator = localStorage.getItem("creator");
    if (creator) setUser(JSON.parse(creator));

    const fetchBids = async () => {
      if (!user) return;

      try {
        console.log("Fetching bids for user: " + user);
        const response = await fetch(`http://localhost:8000/get-bids/${user}`);

        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }

        const data: Bid[] = await response.json();
        setBids(data);
      } catch (error) {
        setError("Error fetching bids. Please try again later.");
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [user]);

  const handlePublishBid = async (bidId: string) => {
    const bidToPublish = bids.find((bid) => bid._id === bidId);

    if (!bidToPublish) {
      console.error("Bid not found");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/publish-bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidToPublish),
      });

      if (!response.ok) {
        throw new Error("Failed to publish bid");
      }

      const data = await response.json();
      console.log("Bid published:", data);

      setBids((prevBids) =>
        prevBids.map((bid) =>
          bid._id === bidId ? { ...bid, isPublished: true } : bid
        )
      );
    } catch (error) {
      setError("Error publishing bid. Please try again later.");
      console.error("Error publishing bid:", error);
    }
  };

  const handleRemoveBid = async (bidId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/remove-bid/${bidId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove bid");
      }

      setBids((prevBids) => prevBids.filter((bid) => bid._id !== bidId));
      console.log("Bid removed:", bidId);
    } catch (error) {
      setError("Error removing bid. Please try again later.");
      console.error("Error removing bid:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    bidId: string,
    field: string
  ) => {
    const { value } = event.target;
    setBids((prevBids) =>
      prevBids.map((bid) =>
        bid._id === bidId ? { ...bid, [field]: value } : bid
      )
    );
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading bids...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Bid</h1>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Created Bids</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Creator</th>
              <th className="px-4 py-2">Start Time</th>
              <th className="px-4 py-2">End Time</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bids.length > 0 ? (
              bids.map((bid) => (
                <tr key={bid._id}>
                  <td className="border px-4 py-2">
                    <Link href={`/creator-dashboard/${bid._id}`}>
                      {bid.title}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{bid.creator}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="datetime-local"
                      value={bid.startTime || ""}
                      onChange={(e) =>
                        handleInputChange(e, bid._id, "startTime")
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="datetime-local"
                      value={bid.endTime || ""}
                      onChange={(e) => handleInputChange(e, bid._id, "endTime")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    {bid.isPublished ? "Published" : "Draft"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handlePublishBid(bid._id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                      disabled={bid.isPublished}
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleRemoveBid(bid._id)}
                      className="bg-red-500 mt-2 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No bids available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
