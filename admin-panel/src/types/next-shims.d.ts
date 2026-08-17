declare module 'next' {
  export interface NextConfig {
    [key: string]: unknown;
  }
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: unknown;
  }
}

declare module 'next/link' {
  import type * as React from 'react';
  const Link: React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;
  export default Link;
}
