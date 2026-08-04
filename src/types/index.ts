export type JourneyState = 'idle' | 'listening' | 'thinking' | 'interview' | 'roadmap';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface Scheme {
  id: string;
  title: string;
  department: string;
  benefit: string;
  tags: string[];
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  actionLabel?: string;
}
