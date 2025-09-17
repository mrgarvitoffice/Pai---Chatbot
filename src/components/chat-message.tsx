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
        <Avatar className="size-8 border bg-gradient-to-tr from-primary to-secondary text-primary-foreground flex-shrink-0">
            <div className="flex items-center justify-center h-full w-full">
                <PaiLogo className="size-5" />
            </div>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[85%] md:max-w-[85%] rounded-2xl text-base',
          isAssistant
            ? 'bg-muted rounded-tl-none'
            : 'bg-gradient-to-br from-secondary via-pink-500 to-rose-500 text-primary-foreground rounded-br-none shadow-lg'
        )}
      >
        {typeof content === 'string' ? (
          <div className="p-4 whitespace-pre-wrap">{content}</div>
        ) : (
          content
        )}
      </div>
       {!isAssistant && (
        <Avatar className="size-8 border flex-shrink-0 bg-gradient-to-br from-pink-500 to-rose-500">
            <AvatarFallback className="bg-transparent text-primary-foreground">
                <User className="size-4" />
            </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
