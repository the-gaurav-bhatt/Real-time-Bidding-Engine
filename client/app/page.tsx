"use client";
import { useState, useEffect } from "react";
import Welcome from "./components/welcome";
import { socket } from "@/socket";

export default function Home() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(socket.connected);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>
        {connected ? (
          <span className="text-green-500">Connected to the server</span>
        ) : (
          <span className="text-red-700">Not connected to the server</span>
        )}
      </div>

      <Welcome />
    </main>
  );
}
