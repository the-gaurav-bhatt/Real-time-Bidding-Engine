"use client";
// import { socket } from "@/socket";
import { useEffect, useState } from "react";
import Welcome from "./components/welcome";
import { socket } from "@/socket";

export default function Home() {
  const [connected, setConnected] = useState(socket.connected);
  // socket.connect();
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      setConnected(true);
    });
    socket.on("disconnect", () => {
      console.log("Dis-Connected");
      setConnected(false);
    });
  }, [socket]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {connected ? "Connected" : "Disconnected"}
      <Welcome />
    </main>
  );
}
