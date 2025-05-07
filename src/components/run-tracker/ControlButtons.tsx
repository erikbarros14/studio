
"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

interface ControlButtonsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function ControlButtons({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
}: ControlButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      {!isRunning ? (
        <Button
          size="lg"
          onClick={onStart}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          aria-label="Start run"
        >
          <Play className="mr-2 h-5 w-5" /> Start Run
        </Button>
      ) : isPaused ? (
        <>
          <Button
            size="lg"
            onClick={onResume}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Resume run"
          >
            <Play className="mr-2 h-5 w-5" /> Resume
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={onStop}
            className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Stop run"
          >
            <Square className="mr-2 h-5 w-5" /> Stop
          </Button>
        </>
      ) : (
        <>
          <Button
            size="lg"
            onClick={onPause}
            variant="outline"
            className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Pause run"
          >
            <Pause className="mr-2 h-5 w-5" /> Pause
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={onStop}
            className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Stop run"
          >
            <Square className="mr-2 h-5 w-5" /> Stop
          </Button>
        </>
      )}
    </div>
  );
}
