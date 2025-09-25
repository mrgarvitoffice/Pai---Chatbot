
"use client";

import { FC, useState, useRef, ReactNode } from 'react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, FileText, ThumbsUp, ThumbsDown, Volume2, Download, Loader2 } from 'lucide-react';
import { PaiLogo } from './icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button';
import { textToSpeechAction } from '@/lib/actions';

export const ChatMessage: FC<ChatMessageType & { onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void }> = ({ id, role, content, sources, feedback, rawContent, onFeedback }) => {
  const isAssistant = role === 'assistant';
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleListen = async () => {
      if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
          return;
      }

      setIsLoadingAudio(true);
      try {
          if (audioRef.current) {
              audioRef.current.play();
              setIsPlaying(true);
          } else if (rawContent) {
              const { audioUrl } = await textToSpeechAction(rawContent);
              const audio = new Audio(audioUrl);
              audioRef.current = audio;
              audio.play();
              setIsPlaying(true);
              audio.onended = () => setIsPlaying(false);
          }
      } catch (error) {
          console.error("Failed to play audio:", error);
      } finally {
          setIsLoadingAudio(false);
      }
  };
  
  const handleDownload = () => {
      if (!rawContent) return;
      const blob = new Blob([rawContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pai-response.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (typeof content === 'string') {
      return <div className="p-4">{content}</div>;
    }
    return content;
  };

  return (
    <div className={cn('flex items-start gap-3 animate-slide-in-up', isAssistant ? '' : 'justify-end')}>
      {isAssistant && (
        <Avatar className="size-8 border-2 border-primary/30 bg-card text-primary flex-shrink-0 shadow-lg">
            <div className="flex items-center justify-center h-full w-full bg-background">
                <PaiLogo className="size-5 text-primary" />
            </div>
        </Avatar>
      )}
      <div
        className={cn(
          'w-full max-w-[85%] md:max-w-[85%] rounded-2xl text-sm md:text-base',
          isAssistant
            ? 'bg-card/80 backdrop-blur-md rounded-tl-none shadow-md border border-border/30'
            : 'bg-user-bubble text-primary-foreground rounded-br-none shadow-md'
        )}
      >
        {renderContent()}

        {isAssistant && onFeedback && (
             <div className="px-2 pb-2 mt-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {sources && sources.length > 0 && (
                        <div className="flex items-center gap-1 border-r border-border/50 pr-2 mr-1">
                            <p className="text-xs font-semibold text-muted-foreground pl-1">SOURCES:</p>
                             <TooltipProvider>
                                {sources.map((source, index) => (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted/50">
                                                <FileText className="size-4 text-muted-foreground" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">{source.name}</p>
                                            <p className="text-xs text-muted-foreground">Updated: {source.last_updated}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </TooltipProvider>
                        </div>
                    )}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={handleListen} disabled={isLoadingAudio}>
                                    {isLoadingAudio ? <Loader2 className="size-4 animate-spin"/> : <Volume2 className="size-4" />}
                                </Button>
                            </TooltipTrigger>
                             <TooltipContent><p>Listen to response</p></TooltipContent>
                        </Tooltip>
                         <Tooltip>
                             <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={handleDownload}>
                                    <Download className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Download response</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex items-center gap-1">
                     <TooltipProvider>
                        <Tooltip>
                             <TooltipTrigger asChild>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={cn("size-7 rounded-full", feedback === 'like' && 'bg-primary/10 text-primary')}
                                    onClick={() => onFeedback(id, 'like')}
                                >
                                    <ThumbsUp className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Good response</p></TooltipContent>
                        </Tooltip>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={cn("size-7 rounded-full", feedback === 'dislike' && 'bg-destructive/10 text-destructive')}
                                    onClick={() => onFeedback(id, 'dislike')}
                                >
                                    <ThumbsDown className="size-4" />
                                </Button>
                            </TooltipTrigger>
                             <TooltipContent><p>Bad response</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        )}
      </div>
       {!isAssistant && (
        <Avatar className="size-8 border-2 border-primary/50 flex-shrink-0 bg-user-bubble shadow-md">
            <AvatarFallback className="bg-transparent text-primary-foreground">
                <User className="size-4" />
            </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
