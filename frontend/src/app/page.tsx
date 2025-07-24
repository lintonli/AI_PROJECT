// app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Message, Thread } from '@/types';
import { api } from '@/services/api';
import ChatSidebar from './components/chatSidebar';
import ChatWindow from './components/chatWindow';
import ChatInput from './components/chatInput';



export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load threads on mount
  useEffect(() => {
    loadThreads();
  }, []);

  // Load messages when thread changes
  useEffect(() => {
    if (currentThread) {
      loadMessages(currentThread.id);
    } else {
      setMessages([]);
    }
  }, [currentThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadThreads = async () => {
    try {
      const data = await api.getThreads();
      setThreads(data);
      
      // Set first thread as current if none selected
      if (!currentThread && data.length > 0) {
        setCurrentThread(data[0]);
      }
    } catch (error) {
      console.error('Failed to load threads:', error);
    }
  };

  const loadMessages = async (threadId: number) => {
    try {
      const data = await api.getThreadMessages(threadId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const createNewThread = async () => {
    try {
      const newThread = await api.createThread(`Chat ${format(new Date(), 'MMM d, h:mm a')}`);
      setThreads(prev => [newThread, ...prev]);
      setCurrentThread(newThread);
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };
  const deleteThread = async (threadId: number) => {
  try {
    await api.deleteThread(threadId);
    
    // Remove thread from state
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    
    // If we deleted the current thread, select another one or clear
    if (currentThread?.id === threadId) {
      const remainingThreads = threads.filter(thread => thread.id !== threadId);
      if (remainingThreads.length > 0) {
        setCurrentThread(remainingThreads[0]);
      } else {
        setCurrentThread(null);
        setMessages([]);
      }
    }
  } catch (error) {
    console.error('Failed to delete thread:', error);
    alert('Failed to delete conversation');
  }
};

  const selectThread = (thread: Thread) => {
    setCurrentThread(thread);
  };

  const sendMessage = async (message: string) => {
    if (!currentThread || !message.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Add user message immediately
      const userMessage: Message = { role: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);

      
      const response = await api.sendMessage({
        thread_id: currentThread.id,
        question: message
      });
      
      // Add assistant response
      const assistantMessage: Message = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        threads={threads}
        currentThread={currentThread}
        onSelectThread={selectThread}
        onCreateThread={createNewThread}
        isOpen={sidebarOpen}
        onDeleteThread={deleteThread}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        {currentThread ? (
          <>
            <ChatWindow 
              messages={messages} 
              currentThread={currentThread}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput 
              onSend={sendMessage} 
              isLoading={isLoading}
              disabled={!currentThread}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center p-8 max-w-md">
              <div className="bg-white rounded-full p-4 w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Travel Assistant</h2>
              <p className="text-gray-600 mb-6">
                Start a new conversation or select an existing one to begin chatting about your travel plans.
              </p>
              <button
                onClick={createNewThread}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}