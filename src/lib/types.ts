export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  sentiment?: SentimentData;
  audioUrl?: string; 
}

export interface SentimentData {
  sentiment: 'positive' | 'negative' | 'neutral' | string;
  score: number; // -1 to 1
}

export interface MoodPoint {
  name: string; // Typically message index or timestamp string
  score: number;
}

export interface AudioExercise {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  icon?: React.ElementType;
}
