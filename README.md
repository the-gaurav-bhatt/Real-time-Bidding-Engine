# Real-Time Collaborative Bidding Engine - Full Documentation

## Overview

This document describes the full implementation of a real-time collaborative bidding engine, including both the backend (Node.js, Express.js, Socket.io, MongoDB) and the frontend (Next.js). The engine allows Bid Creators to create and manage bids, while Bidders can participate in these bids in real-time.

## Technology Stack

**Backend:**

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for Node.js.
- **Socket.io:** Enables real-time, bidirectional communication between the server and clients.
- **MongoDB:** NoSQL database for storing bid data and user information.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
- **TypeScript:** Statically typed superset of JavaScript.

**Frontend:**

- **Next.js:** React framework for building server-rendered and static web applications.
- **React:** JavaScript library for building user interfaces.
- **Socket.io Client:** Client-side library for connecting to Socket.io servers.

## User Flow

**Bid Creator:**

1. **Create Bid:** Uses the `Create Bid` page to create a new bid.
2. **Manage Bids:** Uses the `Creator Dashboard` to view, publish, and manage created bids.
3. **Invite Bidders:** Uses the `Invite Bidders` page to invite specific bidders to a bid.

**Bidder:**

1. **View Bids:** Uses the `Bidder Dashboard` to view available bids.
2. **Accept Bids:** Accepts bids they are interested in participating in.
3. **Receive Invitations:** Receives invitations from Bid Creators and can choose to accept or reject them.

## Real-time Updates (Socket.io)

The application uses Socket.io to provide real-time updates for:

- **Bid Invitations:** Bidders receive real-time invitations from Bid Creators.
- **Bid Updates:** Bidders can come in the top-rank and win the item in the bid

## Data Models (Same as Backend)

- **`Bid`:**

  - `title`: String - The title of the bid.
  - `creator`: ObjectId - Reference to the user who created the bid.
  - `items`: Array of objects - Each object represents a bid item with a name, description, and starting price.
  - `startTime`: Date - The scheduled start time of the bid.
  - `endTime`: Date - The scheduled end time of the bid.
  - `isPublished`: Boolean - Indicates whether the bid is published and live.
  - `bidders`: Array of ObjectIds - References to the users who are participating in the bid.

- **`User`:**
  - `username`: String - The username of the user.
  - `role`: String - The role of the user ("BidCreator" or "Bidder").
  - `bids`: Array of ObjectIds - References to the bids the user is participating in.

## API Endpoints (Same as Backend)

| Method | Endpoint              | Description                                |
| ------ | --------------------- | ------------------------------------------ |
| GET    | `/get-bids/:creator`  | Get all bids for a specific creator.       |
| GET    | `/getAllBids`         | Get all bids.                              |
| GET    | `/bidders`            | Get all bidders.                           |
| GET    | `/getBid/:bidId`      | Get a single bid by ID.                    |
| POST   | `/finalizeBid/:bidId` | Finalize a bid.                            |
| POST   | `/create-bid`         | Create a new bid.                          |
| POST   | `/createBidder`       | Create a new bidder.                       |
| POST   | `/invite-bidders`     | (Not implemented) Invite bidders to a bid. |
| POST   | `/publish-bid`        | Publish a bid.                             |

## Conclusion

This documentation provides an overview of a real-time collaborative bidding engine implemented using Node.js, Express.js, Socket.io, MongoDB, and Next.js. While the core functionality is in place, there are opportunities for further enhancements to create a more complete and robust bidding platform.
