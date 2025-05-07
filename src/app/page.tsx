
"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import type { Run } from "@/lib/types";
import { StatsDisplay } from "@/components/run-tracker/StatsDisplay";
import { ControlButtons } from "@/components/run-tracker/ControlButtons";
import { RunSummary } from "@/components/run-tracker/RunSummary";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

// Constants for simulation
const TICK_INTERVAL = 1000; // milliseconds
const DISTANCE_PER_TICK = 0.002; // km per tick (approx 7.2 km/h)
const CALORIES_PER_TICK = 0.1; // kcal per tick (approx 6 kcal/min)

export default function TrackerPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && !isPaused && startTime !== null) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        setDistance((prev) => prev + DISTANCE_PER_TICK);
        setCalories((prev) => prev + CALORIES_PER_TICK);
      }, TICK_INTERVAL);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, isPaused, startTime]);

  const resetState = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    setElapsedTime(0);
    setDistance(0);
    setCalories(0);
    setShowSummary(false);
  }, []);

  const handleStart = () => {
    resetState(); // Reset previous run data if any
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(Date.now() - elapsedTime * 1000); // Preserve elapsed time if resuming from a full stop (though resetState clears it first now)
    setShowSummary(false);
    toast({ title: "Run Started!", description: "Let's go!", duration: 3000 });
  };

  const handlePause = () => {
    setIsPaused(true);
    toast({ title: "Run Paused", description: "Take a breather.", duration: 3000 });
  };

  const handleResume = () => {
    setIsPaused(false);
    // Adjust startTime to account for the pause duration
    if (startTime) { // Check if startTime is not null
        setStartTime(Date.now() - elapsedTime * 1000);
    }
    toast({ title: "Run Resumed", description: "Keep going!", duration: 3000 });
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false); // Ensure isPaused is false when stopped
    setShowSummary(true);
    toast({ title: "Run Stopped", description: "Great effort!", duration: 3000 });
  };

  const handleSaveRun = () => {
    if (typeof window !== "undefined") {
      const newRun: Run = {
        id: crypto.randomUUID(), // Generate a unique ID
        date: new Date().toISOString(),
        time: elapsedTime,
        distance: distance,
        calories: calories,
      };

      const existingRunsJSON = localStorage.getItem("runs");
      const existingRuns: Run[] = existingRunsJSON ? JSON.parse(existingRunsJSON) : [];
      localStorage.setItem("runs", JSON.stringify([newRun, ...existingRuns]));

      toast({
        title: "Run Saved!",
        description: "Your activity has been added to your history.",
        duration: 3000,
      });
      resetState();
    }
  };

  const handleDiscardRun = () => {
    resetState();
    toast({ title: "Run Discarded", description: "Ready for the next one?", duration: 3000 });
  };
  
  // Dynamic background style based on running state
  const backgroundStyle: CSSProperties = {
    transition: 'background-color 0.5s ease-in-out',
    backgroundColor: isRunning && !isPaused ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--background))',
  };


  return (
    <div style={backgroundStyle} className="min-h-[calc(100vh-8rem)] py-8"> {/* Adjust min-h to account for header/footer */}
      <div className="container mx-auto px-4 flex flex-col items-center">
        {!showSummary ? (
          <>
            <Card className="w-full max-w-2xl p-6 sm:p-8 shadow-xl mb-8 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">
                  {isRunning ? (isPaused ? "Run Paused" : "Keep Going!") : "Start Your Run"}
                </h1>
                <StatsDisplay
                  elapsedTime={elapsedTime}
                  distance={distance}
                  calories={calories}
                />
                <ControlButtons
                  isRunning={isRunning}
                  isPaused={isPaused}
                  onStart={handleStart}
                  onPause={handlePause}
                  onResume={handleResume}
                  onStop={handleStop}
                />
              </CardContent>
            </Card>
            {!isRunning && elapsedTime === 0 && (
                 <div className="mt-8 w-full max-w-2xl text-center">
                    <Image 
                        src="https://picsum.photos/800/400"
                        alt="Scenic running route"
                        width={800}
                        height={400}
                        className="rounded-lg shadow-lg object-cover mx-auto"
                        data-ai-hint="running nature"
                        priority
                    />
                    <p className="mt-4 text-lg text-muted-foreground italic">"The miracle isn't that I finished. The miracle is that I had the courage to start." – John Bingham</p>
                 </div>
            )}
          </>
        ) : (
          <RunSummary
            runData={{ time: elapsedTime, distance, calories }}
            onSave={handleSaveRun}
            onDiscard={handleDiscardRun}
          />
        )}
      </div>
    </div>
  );
}
