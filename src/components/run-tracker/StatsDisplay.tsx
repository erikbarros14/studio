
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Footprints, Flame, MountainSnow } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  colorClass?: string;
}

const StatCard = ({ title, value, unit, icon, colorClass = "text-primary" }: StatCardProps) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={colorClass}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground">
        {value}
        {unit && <span className="text-lg font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
    </CardContent>
  </Card>
);

interface StatsDisplayProps {
  elapsedTime: number;
  distance: number;
  calories: number;
}

export function StatsDisplay({ elapsedTime, distance, calories }: StatsDisplayProps) {
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title="Time"
        value={formatTime(elapsedTime)}
        icon={<Timer className="h-5 w-5" />}
        colorClass="text-primary"
      />
      <StatCard
        title="Distance"
        value={distance.toFixed(2)}
        unit="km"
        icon={<Footprints className="h-5 w-5" />}
        colorClass="text-accent"
      />
      <StatCard
        title="Calories Burned"
        value={Math.round(calories)}
        unit="kcal"
        icon={<Flame className="h-5 w-5" />}
        colorClass="text-destructive"
      />
    </div>
  );
}
