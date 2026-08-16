export interface ScrapedSchemeApproval {
  id: string;
  name: string;
  department: string;
  eligibilitySummary: string;
  sourceUrl: string;
  dateScraped: string;
}

export const mockPendingApprovals: ScrapedSchemeApproval[] = [
  { 
    id: 'P-1', 
    name: 'Gramin Awas Yojana 2024 (Draft)', 
    department: 'Rural Development', 
    eligibilitySummary: 'Rural citizens below poverty line (BPL). Must not own a pucca house. Income < 1.2 Lakhs/year.', 
    sourceUrl: 'https://example.gov.in/scheme/123',
    dateScraped: '2023-09-15 10:30 AM'
  },
  { 
    id: 'P-2', 
    name: 'Student Laptop Scheme', 
    department: 'Education', 
    eligibilitySummary: 'Students passing 12th grade in state board with >80% marks. Domicile required.', 
    sourceUrl: 'https://example.gov.in/edu/laptops',
    dateScraped: '2023-09-15 10:45 AM'
  },
  { 
    id: 'P-3', 
    name: 'Solar Pump Subsidy', 
    department: 'Agriculture', 
    eligibilitySummary: 'Farmers with valid agricultural land records. Applicable for 3HP to 5HP pumps.', 
    sourceUrl: 'https://example.gov.in/agri/solar',
    dateScraped: '2023-09-15 11:00 AM'
  }
];
