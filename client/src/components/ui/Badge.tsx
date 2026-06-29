import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}

const variantClasses: Record<string, string> = {
  default: 'bg-[#f3f4f6] text-[#374151] border border-[#d1d5db]',
  blue:    'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]',
  green:   'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]',
  red:     'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]',
  yellow:  'bg-[#fffbeb] text-[#b45309] border border-[#fde68a]',
  purple:  'bg-[#f5f3ff] text-[#6d28d9] border border-[#ddd6fe]',
  gray:    'bg-[#f9fafb] text-[#6b7280] border border-[#e5e7eb]',
};

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
