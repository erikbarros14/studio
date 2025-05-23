import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex items-end gap-2 mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><Bot className="h-5 w-5 text-primary-foreground" /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md break-words',
          isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
        )}
      >
        <p className="text-sm">{message.text}</p>
        {message.audioUrl && (
          <audio controls src={message.audioUrl} className="w-full mt-2 h-10">
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><User className="h-5 w-5 text-primary-foreground" /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
