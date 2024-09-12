"use client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Actiontypes = "forward" | "left" | "stop" | "right" | "reverse";

export default function Home() {
  const [actionMessage, setActionMessage] = useState("");

  // Handle action button clicks
  const handleAction = async (action: Actiontypes) => {
    try {
      const response = await fetch(`/py/${action}`, {
        method: "POST",  // No body is needed since the path contains the required data
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setActionMessage(data.message);
    } catch (error) {
      console.error("Error performing action:", error);
      setActionMessage("Failed to perform action");
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Raspberry Pi</h1>
      {/* <img
        src="/py/mjpeg"
        alt="AHHHHHH"
        className="w-2/3"
      /> */}

      {/* BUTTONS LAYOUT */}
      <div className="flex flex-col items-center space-y-5 mb-6">
        {/* Forward Button */}
        <Button variant="outline" className="w-24" onClick={() => handleAction("forward")}>
          Forward
        </Button>

        {/* Row with Left, Stop, and Right */}
        <div className="flex space-x-5">
          <Button variant="outline" className="w-24" onClick={() => handleAction("left")}>
            Left
          </Button>

          <Button variant="outline" className="w-24" onClick={() => handleAction("stop")}>
            Stop
          </Button>

          <Button variant="outline" className="w-24" onClick={() => handleAction("right")}>
            Right
          </Button>
        </div>

        {/* Reverse Button */}
        <Button variant="outline" className="w-24" onClick={() => handleAction("reverse")}>
          Reverse
        </Button>
      </div>
    </main>
  );
}
