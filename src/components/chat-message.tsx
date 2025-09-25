import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, FileText } from 'lucide-react';
import { PaiLogo } from './icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ReactMarkdown from 'react-markdown';


export const ChatMessage: FC<ChatMessageType> = ({ role, content, sources }) => {
  const isAssistant = role === 'assistant';

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
          'max-w-[85%] md:max-w-[85%] rounded-2xl text-sm md:text-base',
          isAssistant
            ? 'bg-card/80 backdrop-blur-md rounded-tl-none shadow-md border border-border/30'
            : 'bg-user-bubble text-primary-foreground rounded-br-none shadow-md'
        )}
      >
        {typeof content === 'string' ? (
          <div className="p-4 prose prose-sm dark:prose-invert prose-p:my-2 prose-headings:my-3 prose-ul:my-2 max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          content
        )}
         {isAssistant && sources && sources.length > 0 && (
            <div className="p-2 border-t border-border/50 mt-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-muted-foreground px-2">SOURCES:</p>
                    <div className="flex items-center gap-1">
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
