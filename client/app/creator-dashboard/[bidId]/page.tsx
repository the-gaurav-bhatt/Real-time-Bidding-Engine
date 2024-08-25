// app/creator-dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/socket";
// Type definition for User
interface User {
  _id: string;
  username: string;
  socketId?: string; // Optional in case socket ID is not available
}

// Initialize socket with type annotation

const CreatorDashboard = ({ params }: { params: { bidId: string } }) => {
  // Define types for state
  const [users, setUsers] = useState<User[]>([]);
  console.log(params);
  const [currentBid, setCurrentBid] = useState<string>(params.bidId);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/bidders");
        const data: User[] = await response.json(); // Define the type of the response data
        setUsers(data); // Set users data with type safety
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInvite = (invitedUser: User) => {
    // Emit invite event via socket with proper types
    console.log(currentBid);
    socket.emit("inviteEvent", {
      inviterUser: invitedUser,
      invitedUserSocketId: invitedUser._id, // Assuming _id is used as socket ID in production
      bidId: currentBid,
    });
    console.log(`Invitation sent to ${invitedUser.username}`);
  };

  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Invite Users to Your Bid
      </h1>
      <div className="max-w-3xl mx-auto  shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Available Users</h2>
        <ul className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user._id} // Using _id as the unique key
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
