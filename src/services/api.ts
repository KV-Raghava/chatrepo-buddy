
// Base API URL - update this to your FastAPI backend URL when deployed
export const API_URL = "http://localhost:8000/api";

// Types
export interface ApiMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;  // ISO string format
  session_id: string;
}

export interface ApiChatSession {
  id: string;
  title: string;
  last_message?: string;
  timestamp: string;
  is_active?: boolean;
}

// Chat API functions
export const fetchChatSessions = async (): Promise<ApiChatSession[]> => {
  try {
    const response = await fetch(`${API_URL}/chat/sessions`);
    if (!response.ok) {
      throw new Error('Failed to fetch chat sessions');
    }
    const data = await response.json();
    return data.sessions;
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
};

export const createChatSession = async (title: string, repositoryId: string): Promise<ApiChatSession> => {
  try {
    const response = await fetch(`${API_URL}/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, repositoryId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create chat session');
    }
    
    const data = await response.json();
    return data.session;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

export const deleteChatSession = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete chat session');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
};

export const fetchChatMessages = async (sessionId: string): Promise<ApiMessage[]> => {
  try {
    const response = await fetch(`${API_URL}/chat/sessions/${sessionId}/messages`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat messages');
    }
    
    const data = await response.json();
    return data.messages;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export const sendChatMessage = async (sessionId: string, content: string): Promise<ApiMessage> => {
  try {
    const response = await fetch(`${API_URL}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};
