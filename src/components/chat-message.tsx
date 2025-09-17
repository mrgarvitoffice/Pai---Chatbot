import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { PaiLogo } from './icons';

export const ChatMessage: FC<ChatMessageType> = ({ role, content }) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={cn('flex items-start gap-3 animate-slide-in-up', isAssistant ? '' : 'justify-end')}>
      {isAssistant && (
        <Avatar className="size-8 border bg-card text-primary-foreground flex-shrink-0 shadow-md">
            <div className="flex items-center justify-center h-full w-full">
                <PaiLogo className="size-5 text-primary" />
            </div>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[85%] md:max-w-[85%] rounded-2xl text-base',
          isAssistant
            ? 'bg-card/60 dark:bg-card/80 backdrop-blur-md rounded-tl-none shadow-md'
            : 'bg-user-bubble dark:bg-user-bubble dark:glow-sm text-foreground rounded-br-none shadow-md'
        )}
      >
        {typeof content === 'string' ? (
          <div className="p-4 whitespace-pre-wrap font-sans">{content}</div>
        ) : (
          content
        )}
      </div>
       {!isAssistant && (
        <Avatar className="size-8 border flex-shrink-0 bg-user-bubble shadow-md">
            <AvatarFallback className="bg-transparent text-foreground">
                <User className="size-4" />
            </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
