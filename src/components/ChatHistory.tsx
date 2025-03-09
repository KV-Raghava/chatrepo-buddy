
import React from 'react';
import { Search, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface ChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: string;
  isActive?: boolean;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (id: string) => void;
  className?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  className
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("flex flex-col h-full border-r border-border", className)}>
      <div className="p-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 mb-4"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg group flex items-start justify-between",
                  session.isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-secondary/50 text-foreground"
                )}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{session.title}</p>
                    {session.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {session.lastMessage}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.timestamp}
                    </p>
                  </div>
                </div>
                
                {onDeleteSession && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No conversations found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
