// src/app/chat-page-client.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/calmwave/message-bubble';
import { MoodTrackerChart } from '@/components/calmwave/mood-tracker-chart';
import { EmergencyKitModal } from '@/components/calmwave/emergency-kit-modal';
import { AudioExercisePlayer, audioExercisesList } from '@/components/calmwave/audio-exercise-player';
import type { ChatMessage, MoodPoint, SentimentData, AudioExercise } from '@/lib/types';
import { empatheticChatbot, EmpatheticChatbotInput } from '@/ai/flows/empathetic-chatbot';
import { analyzeSentiment, AnalyzeSentimentInput } from '@/ai/flows/sentiment-analysis';
import useSpeechRecognition from '@/hooks/use-speech-recognition';
import { useToast } from "@/hooks/use-toast";
import { Send, Mic, LifeBuoy, Waves, Bot, User, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function ChatPageClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodPoint[]>([]);
  const [isEmergencyKitOpen, setIsEmergencyKitOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<SentimentData | null>(null);
  
  const [currentPlayingAudioExercise, setCurrentPlayingAudioExercise] = useState<AudioExercise | null>(null);
  const exerciseAudioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (speechError) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: speechError,
      });
    }
  }, [speechError, toast]);
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    // Initial bot message
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hello! I'm CalmWave, your mental wellness companion. How are you feeling today?",
        sender: 'bot',
        timestamp: Date.now(),
      }
    ]);
  }, []);

  const playExerciseAudio = useCallback((exercise: AudioExercise) => {
    if (exerciseAudioRef.current) {
      exerciseAudioRef.current.pause();
    }
    const newAudio = new Audio(exercise.audioUrl);
    exerciseAudioRef.current = newAudio;
    newAudio.play().catch(err => console.error("Error playing audio:", err));
    setCurrentPlayingAudioExercise(exercise);
    newAudio.onended = () => {
      setCurrentPlayingAudioExercise(null);
    };
  }, []);

  const stopCurrentExerciseAudio = useCallback(() => {
    if (exerciseAudioRef.current) {
      exerciseAudioRef.current.pause();
      exerciseAudioRef.current.currentTime = 0;
    }
    setCurrentPlayingAudioExercise(null);
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === '' && !transcript) return;
    const textToSend = input.trim() || transcript;
    if (!textToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    resetTranscript();
    setIsLoading(true);

    try {
      // 1. Analyze sentiment
      const sentimentInput: AnalyzeSentimentInput = { text: textToSend };
      const sentimentResult = await analyzeSentiment(sentimentInput);
      setCurrentMood(sentimentResult);
      
      const newMoodPoint: MoodPoint = {
        name: `Msg ${Math.floor(messages.length / 2) + 1}`, // Simple naming for graph
        score: sentimentResult.score,
      };
      setMoodHistory(prev => [...prev, newMoodPoint]);
      
      // Update user message with sentiment (optional, for potential display)
      setMessages(prev => prev.map(msg => msg.id === userMessage.id ? {...msg, sentiment: sentimentResult} : msg));

      // 2. Get empathetic response
      const chatbotInput: EmpatheticChatbotInput = {
        message: textToSend,
        mood: sentimentResult.sentiment,
      };
      const botResponseData = await empatheticChatbot(chatbotInput);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseData.response,
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error in AI processing:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Sorry, I encountered an issue. Please try again.",
      });
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a little trouble connecting right now. Let's try that again in a moment.",
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground p-4 gap-4">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow h-full md:w-2/3 bg-card rounded-xl shadow-xl overflow-hidden p-1 sm:p-2 md:p-4">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-semibold">CalmWave</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsEmergencyKitOpen(true)} className="hover:bg-accent/10 text-destructive hover:text-destructive-foreground">
            <LifeBuoy className="h-6 w-6" />
            <span className="sr-only">Emergency Kit</span>
          </Button>
        </div>

        <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
             <div className="flex items-end gap-2 mb-4 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5 text-primary-foreground" /></AvatarFallback>
                </Avatar>
                <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md bg-card text-card-foreground rounded-bl-none">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t">
          {isListening && (
            <div className="text-sm text-muted-foreground mb-1 animate-pulse">Listening... Say something.</div>
          )}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder={isListening ? "Speak now..." : "Type your message..."}
              className="flex-grow bg-input focus:ring-primary text-base"
              disabled={isLoading}
            />
            {browserSupportsSpeechRecognition && (
              <Button variant="outline" size="icon" onClick={handleMicClick} disabled={isLoading} className="hover:bg-accent/10">
                <Mic className={cn("h-5 w-5", isListening ? "text-destructive animate-pulse" : "text-primary")} />
                <span className="sr-only">{isListening ? "Stop Listening" : "Start Listening"}</span>
              </Button>
            )}
            <Button onClick={handleSendMessage} disabled={isLoading || (!input.trim() && !transcript)} className="bg-primary hover:bg-primary/80 text-primary-foreground">
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar for Mood Tracker and Audio Exercises */}
      <div className="md:w-1/3 flex flex-col gap-4 h-full overflow-y-auto pb-4 md:pb-0">
        <MoodTrackerChart moodData={moodHistory} />
        
        <Card className="shadow-lg flex-grow">
          <CardHeader>
            <CardTitle className="text-md font-medium flex items-center">
              <Waves className="h-5 w-5 mr-2 text-primary" />
              Relaxation Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audioExercisesList.map(exercise => (
              <AudioExercisePlayer 
                key={exercise.id} 
                exercise={exercise}
                isPlayingGlobal={currentPlayingAudioExercise?.id === exercise.id}
                playExercise={playExerciseAudio}
                stopCurrentExercise={stopCurrentExerciseAudio}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <EmergencyKitModal isOpen={isEmergencyKitOpen} onClose={() => setIsEmergencyKitOpen(false)} />
    </div>
  );
}
