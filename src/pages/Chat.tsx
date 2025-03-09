import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import ChatHistory, { ChatSession } from '@/components/ChatHistory';
import MessageInput from '@/components/MessageInput';
import { cn } from '@/lib/utils';

const SAMPLE_CHAT_SESSIONS: ChatSession[] = [
  { 
    id: '1', 
    title: 'React App Structure',
    lastMessage: 'Can you explain the component hierarchy?',
    timestamp: '10:23 AM', 
    isActive: true
  },
  { 
    id: '2', 
    title: 'API Integration Issues',
    lastMessage: 'How do I fix the authentication flow?',
    timestamp: 'Yesterday', 
  },
  { 
    id: '3', 
    title: 'Performance Optimization',
    lastMessage: 'The app is slow when loading large datasets',
    timestamp: 'Sep 15', 
  },
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>(SAMPLE_CHAT_SESSIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        content: 'Hello! I\'m your repository assistant. How can I help you with your code today?',
        sender: 'bot',
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      }
    ];
    
    setMessages(initialMessages);
  }, [repoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: generateBotResponse(content),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "I've analyzed your repository and found that this pattern appears in several files. Would you like me to show some examples?",
      "Based on your codebase, I'd recommend refactoring this section to improve performance.",
      "Looking at your repository structure, I notice you're using an older version of this library. There's a newer approach available.",
      "Your question touches on several parts of the codebase. The main implementation is in the core module, but it interfaces with these other components.",
      "I can see that this functionality was recently changed. Here's how it works now compared to the previous implementation."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSelectSession = (id: string) => {
    setSessions(prev => 
      prev.map(session => ({
        ...session,
        isActive: session.id === id
      }))
    );
    
    toast({
      title: "Chat session changed",
      description: `Switched to "${sessions.find(s => s.id === id)?.title}"`,
    });
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Conversation",
      timestamp: "Just now",
      isActive: true
    };
    
    setSessions(prev => 
      [newSession, ...prev.map(session => ({
        ...session,
        isActive: false
      }))]
    );
    
    setMessages([{
      id: crypto.randomUUID(),
      content: 'Hello! I\'m your repository assistant. How can I help you with your code today?',
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    
    toast({
      title: "Chat deleted",
      description: "The conversation has been removed",
    });
  };

  const formatMessageDate = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col">
      <Header title="Code Chat" showBackButton showSettings />
      
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
              
              {isLoading && (
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
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
