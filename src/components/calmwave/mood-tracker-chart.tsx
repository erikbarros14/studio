'use client';

import type { MoodPoint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { HeartPulse } from 'lucide-react';

interface MoodTrackerChartProps {
  moodData: MoodPoint[];
}

const chartConfig = {
  score: {
    label: "Mood Score",
    color: "hsl(var(--primary))",
  },
};

export function MoodTrackerChart({ moodData }: MoodTrackerChartProps) {
  if (moodData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <HeartPulse className="h-4 w-4 mr-2 text-primary" />
            Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Chat to see your mood trend.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <HeartPulse className="h-4 w-4 mr-2 text-primary" />
          Mood Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={moodData}
              margin={{
                top: 5,
                right: 10,
                left: -20, // Adjust to show YAxis labels if needed
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[-1, 1]}
                ticks={[-1, -0.5, 0, 0.5, 1]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="score"
                type="monotone"
                stroke="var(--color-score)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-score)",
                  r: 3,
                }}
                activeDot={{
                  r: 5,
                  style: { stroke: "hsl(var(--background))", strokeWidth: 2 },
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
