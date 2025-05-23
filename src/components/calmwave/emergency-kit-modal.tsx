'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Phone, Wind, Brain } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface EmergencyKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyKitModal({ isOpen, onClose }: EmergencyKitModalProps) {
  const [isPlayingBreathingAudio, setIsPlayingBreathingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen && !audioRef.current) {
      audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Placeholder breathing exercise
    }
  }, [isOpen]);
  
  const toggleBreathingAudio = () => {
    if (audioRef.current) {
      if (isPlayingBreathingAudio) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlayingBreathingAudio(!isPlayingBreathingAudio);
    }
  };

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    const handleAudioEnd = () => setIsPlayingBreathingAudio(false);
    
    if (currentAudioRef) {
      currentAudioRef.addEventListener('ended', handleAudioEnd);
    }
    
    return () => {
      if (currentAudioRef) {
        currentAudioRef.removeEventListener('ended', handleAudioEnd);
        currentAudioRef.pause();
        currentAudioRef.currentTime = 0;
      }
    };
  }, [isPlayingBreathingAudio]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold text-primary">
            <LifeBuoy className="h-6 w-6 mr-2" />
            Emergency Support Kit
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            If you're in distress, here are some resources that can help. Remember, you're not alone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="font-semibold flex items-center text-foreground"><Phone className="h-5 w-5 mr-2 text-accent" />Professional Help</h3>
            <p className="text-sm text-muted-foreground mt-1">
              If you are in a crisis, please reach out to a mental health professional or a helpline.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 pl-2">
              <li>National Suicide Prevention Lifeline: Call or text 988 (US)</li>
              <li>Crisis Text Line: Text HOME to 741741 (US)</li>
              <li>Find local resources: Search online for "mental health services [your area]"</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg bg-background">
            <h3 className="font-semibold flex items-center text-foreground"><Wind className="h-5 w-5 mr-2 text-accent" />Guided Breathing Exercise</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Take a moment to focus on your breath. This can help calm your mind.
            </p>
            <Button variant="outline" onClick={toggleBreathingAudio} className="mt-2 w-full hover:bg-accent/10">
              {isPlayingBreathingAudio ? 'Pause Exercise' : 'Play 1-Min Breathing Exercise'}
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="font-semibold flex items-center text-foreground"><Brain className="h-5 w-5 mr-2 text-accent" />Grounding Techniques</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reconnect with the present moment:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 pl-2">
              <li><strong>5-4-3-2-1 Technique:</strong> Name 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.</li>
              <li><strong>Body Scan:</strong> Focus on the sensation of your feet on the floor, your back against the chair.</li>
              <li><strong>Mindful Observation:</strong> Pick an object nearby and describe it in detail to yourself.</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="hover:bg-accent/10">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
