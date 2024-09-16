"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check for dark mode based on user system preferences
  useEffect(() => {
    // Use the window.matchMedia API to detect system dark mode preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    // Set the initial state
    setIsDarkMode(mediaQuery.matches)
    
    // Update when system theme changes
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      {/* Full background for unused portion (white in dark mode, black in light mode) */}
      <SliderPrimitive.Track
        className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full border border-gray-400",
          isDarkMode ? "bg-black" : "bg-white"
        )}
      >
        {/* Used portion (white in dark mode, black in light mode) */}
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full",
            isDarkMode ? "bg-white" : "bg-black"
          )}
        />
      </SliderPrimitive.Track>
      {/* Solid thumb */}
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
