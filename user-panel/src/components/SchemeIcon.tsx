import React from 'react';
import { 
  Tractor, 
  ShieldAlert, 
  ShieldCheck, 
  Home, 
  Landmark, 
  Flame, 
  Sun, 
  Sprout, 
  UserCheck, 
  HeartHandshake, 
  Wallet,
  Building2,
  Stethoscope
} from 'lucide-react';
import { Scheme } from '../types';

interface SchemeIconProps {
  iconType: Scheme['iconType'];
  className?: string;
  size?: number;
}

export const SchemeIcon: React.FC<SchemeIconProps> = ({ iconType, className = 'w-6 h-6', size = 24 }) => {
  switch (iconType) {
    case 'tractor':
      return <Tractor className={className} size={size} />;
    case 'shield-plus':
      return <Stethoscope className={className} size={size} />;
    case 'home':
      return <Home className={className} size={size} />;
    case 'bank':
      return <Landmark className={className} size={size} />;
    case 'flame':
      return <Flame className={className} size={size} />;
    case 'sun':
      return <Sun className={className} size={size} />;
    case 'sprout':
      return <Sprout className={className} size={size} />;
    case 'user-check':
      return <UserCheck className={className} size={size} />;
    case 'heart-handshake':
      return <HeartHandshake className={className} size={size} />;
    case 'wallet':
      return <Wallet className={className} size={size} />;
    default:
      return <Building2 className={className} size={size} />;
  }
};
