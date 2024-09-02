"use client";
// import storage from 'local'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "../components/custom-hooks/useUser";
import { socket } from "@/socket";

interface BidItem {
  //   name: string;
  item: string;
  startingPrice: number;
}

interface BidData {
  creator: string;
  title: string;
  items: BidItem[];
}

export default function CreateBidPage() {
  const [bidData, setBidData] = useState<BidData>({
    creator: "",
    title: "",
    items: [],
  });
  const [bidderId, setBidderId] = useState("");
  useEffect(() => {
    const bidder = localStorage.getItem("bidderId");
    if (bidder) setBidderId(bidder);
  }, [bidderId]);
  const router = useRouter();
  const { user, saveUser, logout } = useUser();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBidData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddItem = () => {
    setBidData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { item: "", startingPrice: 0 }],
    }));
  };

  const handleItemChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setBidData((prevData) => ({
      ...prevData,
      items: prevData.items.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const handleCreateBid = async () => {
    const { creator, title, items } = bidData;
    bidData.items = bidData.items.filter(
      (item) => item.item && item.startingPrice > 0
    );
    if (creator && title && items.length > 0) {
      // Send bid data to the server
      const bidToSend = {
        ...bidData,
      };
      const res = await fetch("http://localhost:8000/create-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidToSend),
      });
      if (!user) {
        saveUser(creator);
      }
      const x = await res.json();
      const bidId = x.bidId;
      // this is used to create a room with the bidId
      socket.emit("connectBidding", bidId, bidderId);
      router.push("/creator-dashboard");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Create a New Bid</h1>

      {/* Input for Creator Name */}
      <div className="mb-6">
        <label
          htmlFor="creator"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Your Name:
        </label>
        <input
          type="text"
          id="creator"
          name="creator"
          value={bidData.creator}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Input for Title */}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={bidData.title}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Input for Bid Items */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Bid Items:
        </label>
        {bidData.items.map((item, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              name="item"
              placeholder="item"
              value={item.item}
              onChange={(e) => handleItemChange(index, e)}
              className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <input
              type="number"
              name="startingPrice"
              placeholder="Starting Price"
              value={item.startingPrice}
              onChange={(e) => handleItemChange(index, e)}
              className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Item
        </button>
      </div>

      {/* Create Bid Button */}
      <button
        onClick={handleCreateBid}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Bid
      </button>
    </div>
  );
}
