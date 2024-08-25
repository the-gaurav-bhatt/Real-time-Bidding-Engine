import React from "react";
import Link from "next/link";

const Welcome: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Bidding Engine!
      </h1>
      <p className="text-lg mb-6">Are you a Bid Creator or a Bidder?</p>
      <div className="flex space-x-4">
        <Link href="/create-bid">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Bid
          </button>
        </Link>
        <Link href="/join-bid">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Join Bid
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
