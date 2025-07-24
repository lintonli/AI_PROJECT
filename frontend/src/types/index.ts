
export interface Thread {
  id: number;
  title: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ThreadWithMessages {
  thread_id: number;
  messages: Message[];
}

export interface ChatResponse {
  response: string;
}

export interface MessageRequest {
  thread_id: number;
  question: string;
}

export interface ThreadCreate {
  title?: string;
}
export interface ThreadCreateResponse {
  thread_id: number;
  title: string;
}