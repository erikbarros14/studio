// src/components/calmwave/audio-exercise-player.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AudioExercise } from '@/lib/types';
import { Play, Pause, Waves, Headphones } from 'lucide-react';

interface AudioExercisePlayerProps {
  exercise: AudioExercise;
  onPlaybackChange?: (isPlaying: boolean, exerciseId: string) => void;
  isPlayingGlobal: boolean; // Is this specific exercise the one playing globally?
  playExercise: (exercise: AudioExercise) => void;
  stopCurrentExercise: () => void;
}

export function AudioExercisePlayer({ 
  exercise, 
  onPlaybackChange, 
  isPlayingGlobal, 
  playExercise, 
  stopCurrentExercise 
}: AudioExercisePlayerProps) {
  
  const handlePlayPause = () => {
    if (isPlayingGlobal) {
      stopCurrentExercise();
      onPlaybackChange?.(false, exercise.id);
    } else {
      playExercise(exercise);
      onPlaybackChange?.(true, exercise.id);
    }
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold flex items-center">
            {exercise.icon ? <exercise.icon className="h-5 w-5 mr-2 text-primary" /> : <Headphones className="h-5 w-5 mr-2 text-primary" />}
            {exercise.title}
          </CardTitle>
          <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
            {isPlayingGlobal ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlayingGlobal ? 'Pause' : 'Play'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs text-muted-foreground">{exercise.description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export const audioExercisesList: AudioExercise[] = [
  {
    id: 'nature-sounds',
    title: 'Forest Ambience',
    description: 'Relax with the soothing sounds of a gentle forest.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder
    icon: Waves,
  },
  {
    id: 'guided-meditation',
    title: 'Short Guided Meditation',
    description: 'A 5-minute guided meditation for calm and focus.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder
    icon: Headphones,
  },
  {
    id: 'calming-music',
    title: 'Peaceful Piano',
    description: 'Soft piano music to help you unwind.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', // Placeholder
    icon: Waves,
  },
];
