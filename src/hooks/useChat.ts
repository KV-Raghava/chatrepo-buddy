
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  fetchChatSessions, 
  createChatSession, 
  deleteChatSession, 
  fetchChatMessages, 
  sendChatMessage,
  ApiChatSession,
  ApiMessage
} from '@/services/api';
import { ChatSession } from '@/components/ChatHistory';

// Convert API message to local format
const mapApiMessageToLocal = (apiMessage: ApiMessage): { 
  id: string; 
  content: string; 
  sender: 'user' | 'bot';
  timestamp: Date;
} => {
  return {
    id: apiMessage.id,
    content: apiMessage.content,
    sender: apiMessage.sender,
    timestamp: new Date(apiMessage.timestamp),
  };
};

// Convert API session to local format
const mapApiSessionToLocal = (apiSession: ApiChatSession): ChatSession => {
  return {
    id: apiSession.id,
    title: apiSession.title,
    lastMessage: apiSession.last_message,
    timestamp: apiSession.timestamp,
    isActive: apiSession.is_active || false,
  };
};

interface UseChatOptions {
  initialSessionId?: string;
}

export const useChat = ({ initialSessionId }: UseChatOptions = {}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<{ 
    id: string; 
    content: string; 
    sender: 'user' | 'bot'; 
    timestamp: Date;
  }[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(initialSessionId);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch chat sessions
  const loadSessions = async () => {
    setIsLoadingSessions(true);
    setError(null);
    
    try {
      const apiSessions = await fetchChatSessions();
      const localSessions = apiSessions.map(mapApiSessionToLocal);
      
      // Mark the current session as active
      const updatedSessions = localSessions.map(session => ({
        ...session,
        isActive: session.id === currentSessionId
      }));
      
      setSessions(updatedSessions);
    } catch (err) {
      setError('Failed to load chat sessions');
      toast({
        title: "Error",
        description: "Failed to load chat sessions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Fetch messages for the current session
  const loadMessages = async (sessionId: string) => {
    if (!sessionId) return;
    
    setIsLoadingMessages(true);
    setError(null);
    
    try {
      const apiMessages = await fetchChatMessages(sessionId);
      setMessages(apiMessages.map(mapApiMessageToLocal));
    } catch (err) {
      setError('Failed to load messages');
      toast({
        title: "Error",
        description: "Failed to load chat messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!currentSessionId || !content.trim()) return;
    
    setIsSendingMessage(true);
    
    // Optimistically add user message to UI
    const tempId = `temp-${Date.now()}`;
    const userMessage = {
      id: tempId,
      content,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const apiMessage = await sendChatMessage(currentSessionId, content);
      const botMessage = mapApiMessageToLocal(apiMessage);
      
      // Replace temp message with confirmed message and add bot response
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        { ...userMessage, id: crypto.randomUUID() },
        botMessage
      ]);

      // Update sessions with the new last message
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, lastMessage: content, timestamp: 'Just now' }
          : session
      ));
      
    } catch (err) {
      setError('Failed to send message');
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Remove the optimistically added message
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Select a session
  const selectSession = (id: string) => {
    setCurrentSessionId(id);
    setSessions(prev => 
      prev.map(session => ({
        ...session,
        isActive: session.id === id
      }))
    );
    loadMessages(id);
  };

  // Create a new chat session
  const createNewSession = async (repositoryId: string) => {
    try {
      const title = `New Conversation ${new Date().toLocaleTimeString()}`;
      const newSession = await createChatSession(title, repositoryId);
      const localSession = mapApiSessionToLocal({
        ...newSession,
        is_active: true
      });
      
      setSessions(prev => [localSession, ...prev.map(s => ({ ...s, isActive: false }))]);
      setCurrentSessionId(localSession.id);
      setMessages([]); // Clear messages for new session
      
      return localSession;
    } catch (err) {
      setError('Failed to create new chat');
      toast({
        title: "Error",
        description: "Failed to create new chat. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete a chat session
  const deleteSession = async (id: string) => {
    try {
      await deleteChatSession(id);
      setSessions(prev => prev.filter(session => session.id !== id));
      
      // If we deleted the current session, select another one or clear messages
      if (id === currentSessionId) {
        const remainingSessions = sessions.filter(session => session.id !== id);
        if (remainingSessions.length > 0) {
          selectSession(remainingSessions[0].id);
        } else {
          setMessages([]);
          setCurrentSessionId(undefined);
        }
      }
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed",
      });
    } catch (err) {
      setError('Failed to delete chat session');
      toast({
        title: "Error",
        description: "Failed to delete chat session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    }
  }, [currentSessionId]);

  return {
    sessions,
    messages,
    currentSessionId,
    isLoadingSessions,
    isLoadingMessages,
    isSendingMessage,
    error,
    sendMessage,
    selectSession,
    createNewSession,
    deleteSession,
    refreshSessions: loadSessions,
  };
};
