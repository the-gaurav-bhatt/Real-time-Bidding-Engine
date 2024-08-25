"use client";
// import { socket } from "@/socket";
import { useEffect, useState } from "react";
import Welcome from "./components/welcome";
import { socket } from "@/socket";

export default function Home() {
  const [connected, setConnected] = useState(socket.connected);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>
        {connected ? (
          <span className=" text-green-500">"Connected to the server"</span>
        ) : (
          <span className=" text-red-700">"Not connected to the server"</span>
        )}
      </div>

      <Welcome />
    </main>
  );
}
