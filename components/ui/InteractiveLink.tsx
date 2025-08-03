'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface InteractiveLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function InteractiveLink({ href, children, className, style }: InteractiveLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      style={{
        ...style,
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#000';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#666';
      }}
    >
      {children}
    </Link>
  );
}
