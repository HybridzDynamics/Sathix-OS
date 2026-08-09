export type SchemeStatus = 'Live' | 'Draft' | 'Archived';

export interface Scheme {
  id: string;
  name: string;
  department: string;
  state: string;
  category: string;
  status: SchemeStatus;
  lastUpdated: string;
}

export const mockSchemes: Scheme[] = [
  { id: '1', name: 'Pradhan Mantri Kisan Samman Nidhi', department: 'Agriculture', state: 'Central', category: 'Agriculture', status: 'Live', lastUpdated: '2023-09-01' },
  { id: '2', name: 'Ayushman Bharat Yojana', department: 'Health', state: 'Central', category: 'Health', status: 'Live', lastUpdated: '2023-08-15' },
  { id: '3', name: 'Beti Bachao Beti Padhao', department: 'Women and Child Development', state: 'Central', category: 'Education', status: 'Live', lastUpdated: '2023-07-20' },
  { id: '4', name: 'Mahatma Gandhi National Rural Employment Guarantee Act', department: 'Rural Development', state: 'Central', category: 'Employment', status: 'Live', lastUpdated: '2023-09-10' },
  { id: '5', name: 'Mukhyamantri Amrutum Yojana', department: 'Health', state: 'Gujarat', category: 'Health', status: 'Draft', lastUpdated: '2023-09-12' },
  { id: '6', name: 'Kanya Shiksha Pravesh Utsav', department: 'Education', state: 'Central', category: 'Education', status: 'Live', lastUpdated: '2023-06-05' },
  { id: '7', name: 'Rythu Bandhu Scheme', department: 'Agriculture', state: 'Telangana', category: 'Agriculture', status: 'Live', lastUpdated: '2023-05-18' },
  { id: '8', name: 'Kalika Chetarike', department: 'Education', state: 'Karnataka', category: 'Education', status: 'Archived', lastUpdated: '2022-12-01' },
];
