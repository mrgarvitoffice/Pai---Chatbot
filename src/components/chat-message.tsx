import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { PaiLogo } from './icons';

export const ChatMessage: FC<ChatMessageType> = ({ role, content }) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={cn('flex items-start gap-4', isAssistant ? '' : 'justify-end')}>
      {isAssistant && (
        <Avatar className="size-8 border bg-primary text-primary-foreground flex-shrink-0">
            <div className="flex items-center justify-center h-full w-full">
                <PaiLogo className="size-5" />
            </div>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl text-base',
          isAssistant
            ? 'bg-secondary rounded-tl-none'
            : 'bg-primary text-primary-foreground rounded-br-none'
        )}
      >
        {typeof content === 'string' ? (
          <div className="p-4 whitespace-pre-wrap">{content}</div>
        ) : (
          content
        )}
      </div>
       {!isAssistant && (
        <Avatar className="size-8 border flex-shrink-0">
            <AvatarFallback>
                <User className="size-4" />
            </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
