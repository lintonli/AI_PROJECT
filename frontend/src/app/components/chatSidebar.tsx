// components/ChatSidebar.tsx
import { Thread } from '@/types';
import { useState } from 'react';

interface ChatSidebarProps {
  threads: Thread[];
  currentThread: Thread | null;
  onSelectThread: (thread: Thread) => void;
  onCreateThread: () => void;
  onDeleteThread: (threadId: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatSidebar({
  threads,
  currentThread,
  onSelectThread,
  onCreateThread,
  onDeleteThread,
  isOpen,
  onToggle
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteThread = async (threadId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setDeletingId(threadId);
      try {
        await onDeleteThread(threadId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 p-2 rounded-lg shadow-md"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out md:transition-none inset-y-0 left-0 w-80 bg-gray-900 flex flex-col z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white flex items-center truncate">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">Travel Assistant</span>
            </h1>
            {/* Close button for mobile */}
            <button
              onClick={onToggle}
              className="md:hidden text-gray-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={onCreateThread}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-gray-800">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto bg-gray-900">
          {filteredThreads.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchTerm ? 'No matching conversations' : 'No conversations yet'}
            </div>
          ) : (
            <ul>
              {filteredThreads.map((thread) => (
                <li key={thread.id} className="relative group">
                  <button
                    onClick={() => onSelectThread(thread)}
                    className={`w-full text-left p-4 hover:bg-gray-800 transition ${
                      currentThread?.id === thread.id 
                        ? 'bg-gray-800 border-l-4 border-indigo-500' 
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-white truncate pr-2">
                        {thread.title}
                      </div>
                      <button
                        onClick={(e) => handleDeleteThread(thread.id, e)}
                        disabled={deletingId === thread.id}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity p-1 flex-shrink-0"
                        aria-label="Delete conversation"
                      >
                        {deletingId === thread.id ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 truncate">
                      {thread.title === 'Untitled' ? 'New conversation' : 'Travel chat'}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-800 text-center text-sm text-gray-500">
          Travel Assistant v1.0
        </div>
      </div>
    </>
  );
}