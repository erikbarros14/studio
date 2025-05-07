
"use client";

import type { Run } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Trash2, Award, CalendarDays, Clock, Zap, Route } from "lucide-react";
import { format } from "date-fns";

interface RunSummaryProps {
  runData: Omit<Run, "id" | "date">; // id and date will be set on save
  onSave: () => void;
  onDiscard: () => void;
}

export function RunSummary({ runData, onSave, onDiscard }: RunSummaryProps) {
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-xl border-accent">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">
            <Award className="h-12 w-12 text-accent" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary">Run Complete!</CardTitle>
        <CardDescription>Great job on finishing your run. Here's your summary:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-5 w-5 text-primary" />
            <span>Duration</span>
          </div>
          <span className="font-semibold text-foreground">{formatTime(runData.time)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Route className="h-5 w-5 text-accent" />
            <span>Distance</span>
          </div>
          <span className="font-semibold text-foreground">{runData.distance.toFixed(2)} km</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-5 w-5 text-destructive" />
            <span>Calories Burned</span>
          </div>
          <span className="font-semibold text-foreground">{Math.round(runData.calories)} kcal</span>
        </div>
         <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-5 w-5 text-secondary-foreground" />
            <span>Date</span>
          </div>
          <span className="font-semibold text-foreground">{format(new Date(), "MMMM dd, yyyy")}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button onClick={onSave} className="w-full sm:w-1/2 bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Save run">
          <Save className="mr-2 h-4 w-4" /> Save Run
        </Button>
        <Button variant="outline" onClick={onDiscard} className="w-full sm:w-1/2" aria-label="Discard run">
          <Trash2 className="mr-2 h-4 w-4" /> Discard
        </Button>
      </CardFooter>
    </Card>
  );
}
