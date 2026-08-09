export type LogLevel = 'Info' | 'Warning' | 'Error';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

export const mockLogs: SystemLog[] = [
  { id: '1', timestamp: '2023-09-15T10:23:45Z', level: 'Info', source: 'Scraper', message: 'Successfully scraped 15 schemes from myScheme portal.' },
  { id: '2', timestamp: '2023-09-15T10:25:12Z', level: 'Warning', source: 'OCR', message: 'Low confidence score on Hindi document translation for scheme ID 45.' },
  { id: '3', timestamp: '2023-09-15T10:30:00Z', level: 'Error', source: 'RAG Engine', message: 'Failed to connect to Qdrant vector database. Retrying...' },
  { id: '4', timestamp: '2023-09-15T10:31:05Z', level: 'Info', source: 'RAG Engine', message: 'Connection to Qdrant restored successfully.' },
  { id: '5', timestamp: '2023-09-15T11:05:22Z', level: 'Info', source: 'API', message: 'User requested scheme details in Tamil.' },
  { id: '6', timestamp: '2023-09-15T11:15:40Z', level: 'Error', source: 'Scraper', message: 'Timeout while accessing state portal for Maharashtra.' },
  { id: '7', timestamp: '2023-09-15T11:45:10Z', level: 'Info', source: 'Indexer', message: 'Triggered manual re-indexing of 500 vectors.' },
];
