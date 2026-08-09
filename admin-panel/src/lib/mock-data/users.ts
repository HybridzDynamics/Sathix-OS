export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  preferredLanguage: string;
  joinedDate: string;
  status: UserStatus;
}

export const mockUsers: User[] = [
  { id: '1', name: 'Aarav Patel', email: 'aarav@example.com', phone: '+91 9876543210', state: 'Gujarat', preferredLanguage: 'Gujarati', joinedDate: '2023-01-15', status: 'Active' },
  { id: '2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543211', state: 'Delhi', preferredLanguage: 'Hindi', joinedDate: '2023-02-20', status: 'Active' },
  { id: '3', name: 'Rohan Singh', email: 'rohan@example.com', phone: '+91 9876543212', state: 'Punjab', preferredLanguage: 'Punjabi', joinedDate: '2023-03-05', status: 'Inactive' },
  { id: '4', name: 'Ananya Das', email: 'ananya@example.com', phone: '+91 9876543213', state: 'West Bengal', preferredLanguage: 'Bengali', joinedDate: '2023-04-10', status: 'Active' },
  { id: '5', name: 'Karthik Iyer', email: 'karthik@example.com', phone: '+91 9876543214', state: 'Tamil Nadu', preferredLanguage: 'Tamil', joinedDate: '2023-05-25', status: 'Active' },
  { id: '6', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 9876543215', state: 'Andhra Pradesh', preferredLanguage: 'Telugu', joinedDate: '2023-06-12', status: 'Inactive' },
  { id: '7', name: 'Vikram Joshi', email: 'vikram@example.com', phone: '+91 9876543216', state: 'Maharashtra', preferredLanguage: 'Marathi', joinedDate: '2023-07-30', status: 'Active' },
  { id: '8', name: 'Nisha Gupta', email: 'nisha@example.com', phone: '+91 9876543217', state: 'Uttar Pradesh', preferredLanguage: 'Hindi', joinedDate: '2023-08-18', status: 'Active' },
];
