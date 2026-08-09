export type SourceStatus = 'Active' | 'Paused';

export interface Source {
  id: string;
  name: string;
  url: string;
  stateMinistry: string;
  status: SourceStatus;
  lastScraped: string;
}

export const mockSources: Source[] = [
  { id: '1', name: 'National Portal of India', url: 'https://www.india.gov.in', stateMinistry: 'Central', status: 'Active', lastScraped: '2023-09-15T08:00:00Z' },
  { id: '2', name: 'myScheme', url: 'https://www.myscheme.gov.in', stateMinistry: 'Central', status: 'Active', lastScraped: '2023-09-15T09:30:00Z' },
  { id: '3', name: 'Digital Gujarat', url: 'https://www.digitalgujarat.gov.in', stateMinistry: 'Gujarat', status: 'Active', lastScraped: '2023-09-14T14:15:00Z' },
  { id: '4', name: 'UP Government Schemes', url: 'https://up.gov.in/schemes', stateMinistry: 'Uttar Pradesh', status: 'Paused', lastScraped: '2023-09-10T10:00:00Z' },
  { id: '5', name: 'Tamil Nadu e-Sevai', url: 'https://www.tnesevai.tn.gov.in', stateMinistry: 'Tamil Nadu', status: 'Active', lastScraped: '2023-09-15T11:20:00Z' },
];
