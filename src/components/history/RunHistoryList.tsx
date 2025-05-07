
"use client";

import type { Run } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Footprints, Flame, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import Image from "next/image";

interface RunHistoryListProps {
  runs: Run[];
  onDeleteRun: (id: string) => void;
}

export function RunHistoryList({ runs, onDeleteRun }: RunHistoryListProps) {
  if (runs.length === 0) {
    return (
      <div className="text-center py-12">
        <Image 
          src="https://picsum.photos/400/300" 
          alt="Empty state illustration" 
          width={400} 
          height={300} 
          className="mx-auto rounded-lg mb-6 shadow-md"
          data-ai-hint="empty trail"
        />
        <h2 className="text-2xl font-semibold text-foreground mb-2">No Runs Yet!</h2>
        <p className="text-muted-foreground">Looks like your running shoes are too clean. Time to hit the pavement!</p>
      </div>
    );
  }

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
  };

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {runs.map((run) => (
        <Card key={run.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center justify-between">
              <span>Run on {format(parseISO(run.date), "MMMM dd, yyyy")}</span>
            </CardTitle>
            <CardDescription>{format(parseISO(run.date), "p")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            <div className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-md">
              <span className="flex items-center text-muted-foreground"><Footprints className="mr-2 h-4 w-4 text-accent" /> Distance:</span>
              <span className="font-semibold text-foreground">{run.distance.toFixed(2)} km</span>
            </div>
            <div className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-md">
              <span className="flex items-center text-muted-foreground"><Clock className="mr-2 h-4 w-4 text-primary" /> Time:</span>
              <span className="font-semibold text-foreground">{formatTime(run.time)}</span>
            </div>
            <div className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-md">
              <span className="flex items-center text-muted-foreground"><Flame className="mr-2 h-4 w-4 text-destructive" /> Calories:</span>
              <span className="font-semibold text-foreground">{Math.round(run.calories)} kcal</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDeleteRun(run.id)} 
              className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full"
              aria-label={`Delete run from ${format(parseISO(run.date), "MMMM dd, yyyy")}`}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Run
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
