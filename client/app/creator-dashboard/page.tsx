"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [bids, setBids] = useState([]);
  const [user, setUser] = useState<string>();
  console.log(user);

  useEffect(() => {
    const creator = localStorage.getItem("creator");
    if (creator) setUser(JSON.parse(creator));
    const fetchBids = async () => {
      try {
        console.log("user for the creator-dashboard " + user);
        const response = await fetch(`http://localhost:8000/get-bids/${user}`);
        const data = await response.json();
        console.log(data);
        setBids(data);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    fetchBids();
  }, [user]);

  const handlePublishBid = async (bidId: string) => {
    // Find the bid that matches the bidId
    const bidToPublish = bids.find((bid: any) => bid._id === bidId);

    if (!bidToPublish) {
      console.error("Bid not found");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/publish-bid`, {
        method: "POST", // Assuming the backend expects a POST request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidToPublish), // Send the bid data
      });

      if (!response.ok) {
        throw new Error("Failed to publish bid");
      }

      const data = await response.json();
      console.log("Bid published:", data);

      // Optionally, you can update the UI to reflect that the bid is now published
      setBids((prevBids: any) =>
        prevBids.map((bid: any) =>
          bid._id === bidId ? { ...bid, isPublished: true } : bid
        )
      );
    } catch (error) {
      console.error("Error publishing bid:", error);
    }
  };

  const handleRemoveBid = async (bidId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/remove-bid/${bidId}`,
        {
          method: "DELETE", // Or the appropriate HTTP method for your backend
        }
      );
      // ... handle response and update UI accordingly
    } catch (error) {
      console.error("Error removing bid:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    bidId: string,
    field: string
  ) => {
    const { value } = event.target;
    setBids((prevBids: any) =>
      prevBids.map((bid: any) =>
        bid._id === bidId ? { ...bid, [field]: value } : bid
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Bid</h1>

      {/* Display bids in a table */}
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
            {bids.map((bid: any) => (
              <tr key={bid._id}>
                <td className="border px-4 py-2">
                  <Link href={`/creator-dashboard/${bid._id}`}>
                    {bid.title}
                  </Link>
                </td>
                <td className="border px-4 py-2">{bid._id}</td>
                <td className="border px-4 py-2">
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={bid.startTime || ""}
                    onChange={(e) => handleInputChange(e, bid._id, "startTime")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="datetime-local"
                    name="endTime"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
