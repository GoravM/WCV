"use client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Slider } from "@/components/ui/slider"


type Actiontypes = "forward" | "left" | "stop" | "right" | "reverse";

export default function Home() {
  const [actionMessage, setActionMessage] = useState("");
  const [sliderValue, setSliderValue] = useState([50]);

  // Handle action button clicks
  const handleAction = async (action: Actiontypes | `speed=${number}`) => {
    try {
      const response = await fetch(`/py/motor_control/${action}`, {
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

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    // Send the updated speed to the server
    handleAction(`speed=${value[0]}`);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Raspberry Pi</h1>
      <img
        src="/py/mjpeg"
        alt="AHHHHHH"
        className="w-2/3"
      />

      {/* BUTTONS LAYOUT */}
      <div className="flex flex-col items-center space-y-5 mb-6 ">
        {/* Forward Button */}
        <Button variant="outline" className="w-24 font-bold" onClick={() => handleAction("forward")}>
          Forward
        </Button>

        {/* Row with Left, Stop, and Right */}
        <div className="flex space-x-5">
          <Button variant="outline" className="w-24 font-bold" onClick={() => handleAction("left")}>
            Left
          </Button>

          <Button variant="outline" className="w-24 font-bold" onClick={() => handleAction("stop")}>
            Stop
          </Button>

          <Button variant="outline" className="w-24 font-bold" onClick={() => handleAction("right")}>
            Right
          </Button>
        </div>

        {/* Reverse Button */}
        <Button variant="outline" className="w-24 font-bold" onClick={() => handleAction("reverse")}>
          Reverse
        </Button>
      </div>

      {/* Speed Slider with Labels */}
      <div className="w-72 flex items-center space-x-4">
        <span className="text-foreground">Slow</span>
        <Slider defaultValue={[50]} max={100} step={1} className="flex-grow w-72" 
        value={sliderValue}
        onValueChange={(value) => handleSliderChange(value)} // Send the speed to server on change
        
        ></Slider>

        <span className="text-foreground">Fast</span>
      </div>

      {/* Slide Title */}
      <h1 className="text-2xl mb-6 text-foreground">Speed: {sliderValue[0]}</h1>

    </main>
  );
}
