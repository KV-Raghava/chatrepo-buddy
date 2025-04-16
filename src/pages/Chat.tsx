
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import ChatHistory from '@/components/ChatHistory';
import MessageInput from '@/components/MessageInput';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';

const Chat = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isMobileViewOpen, setIsMobileViewOpen] = React.useState(false);
  
  const {
    messages,
    sessions,
    isLoadingMessages,
    isSendingMessage,
    sendMessage,
    selectSession,
    createNewSession,
    deleteSession
  } = useChat({ initialSessionId: repoId });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    sendMessage(content);
  };

  const handleSelectSession = (id: string) => {
    selectSession(id);
    
    toast({
      title: "Chat session changed",
      description: `Switched to "${sessions.find(s => s.id === id)?.title}"`,
    });
  };

  const handleNewChat = async () => {
    if (!repoId) {
      toast({
        title: "Error",
        description: "Repository ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    await createNewSession(repoId);
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
  };

  const formatMessageDate = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col">
      <Header title="Code Buddy" showBackButton showSettings />
      
      <div className="flex flex-1 overflow-hidden">
        <div 
          className={cn(
            "w-80 flex-shrink-0 bg-sidebar transition-all duration-300 md:translate-x-0",
            isMobileViewOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <ChatHistory 
            sessions={sessions}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            className="h-full"
          />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="md:hidden p-2 border-b border-border">
            <button
              onClick={() => setIsMobileViewOpen(!isMobileViewOpen)}
              className="p-2 rounded-md hover:bg-secondary"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.length === 0 && !isLoadingMessages && (
                <div className="text-center py-10 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Start a conversation about your code</p>
                  <p className="text-sm mt-2">Ask questions about your repository, get code explanations, or request assistance.</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-4 animate-slide-up",
                    message.sender === 'user' ? "justify-end" : ""
                  )}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  
                  <div 
                    className={cn(
                      "rounded-xl max-w-[80%] px-4 py-3",
                      message.sender === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "glass-card"
                    )}
                  >
                    <div className="mb-1">
                      {message.content}
                    </div>
                    <div 
                      className={cn(
                        "text-xs mt-1",
                        message.sender === 'user' 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      )}
                    >
                      {formatMessageDate(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
              
              {(isLoadingMessages || isSendingMessage) && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="glass-card rounded-xl px-4 py-3 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-pulse"></div>
                      <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <MessageInput 
                onSendMessage={handleSendMessage}
                isLoading={isSendingMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

