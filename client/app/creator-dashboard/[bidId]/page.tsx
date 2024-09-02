// app/creator-dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/socket";

interface User {
  _id: string;
  username: string;
  socketId?: string;
}

const CreatorDashboard = ({ params }: { params: { bidId: string } }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentBid, setCurrentBid] = useState<string>(params.bidId);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/bidders");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users. Please try again later.");
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      socket.off("inviteEvent");
    };
  }, []);

  const handleInvite = (invitedUser: User) => {
    try {
      socket.emit("inviteEvent", {
        inviterUser: invitedUser,
        invitedUserSocketId: invitedUser._id,
        bidId: currentBid,
      });
      console.log(`Invitation sent to ${invitedUser.username}`);
    } catch (err) {
      console.error("Failed to send invitation:", err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading users...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Invite Users to Your Bid
      </h1>
      <div className="max-w-3xl mx-auto shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Available Users</h2>
        <ul className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <span className="text-xl font-medium text-gray-800">
                  {user.username}
                </span>
                <button
                  onClick={() => handleInvite(user)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Invite
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No users available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreatorDashboard;
