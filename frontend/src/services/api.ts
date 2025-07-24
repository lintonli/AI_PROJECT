// lib/api.ts
import { Thread, ThreadWithMessages, ChatResponse, MessageRequest, ThreadCreate, ThreadCreateResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  createThread: async (title: string = 'Untitled'): Promise<Thread> => {
    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
   const data: ThreadCreateResponse = await response.json();
    // Convert to Thread interface (thread_id -> id)
    return { id: data.thread_id, title: data.title };
  },

  getThreads: async (): Promise<Thread[]> => {
    const response = await fetch(`${API_BASE_URL}/threads`);
    return response.json();
  },

  getThreadMessages: async (threadId: number): Promise<ThreadWithMessages> => {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}`);
    return response.json();
  },

  sendMessage: async (request: MessageRequest): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return response.json();
  },
  deleteThread: async (threadId: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete thread');
    }
    
    return response.json();
  },
};