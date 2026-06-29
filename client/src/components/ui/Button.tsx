import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

const variants: Record<Variant, string> = {
  primary:   'bg-accent text-white hover:bg-accent-hover border border-accent hover:border-accent-hover',
  secondary: 'bg-white text-gray-700 border border-[#e5e7eb] hover:bg-[#f5f5f5] hover:border-[#d1d5db]',
  ghost:     'bg-transparent text-[#6b7280] hover:bg-[#f5f5f5] hover:text-[#111827] border border-transparent',
  danger:    'bg-[#dc2626] text-white hover:bg-[#b91c1c] border border-[#dc2626]',
  outline:   'bg-white text-accent border border-accent hover:bg-[#eff6ff]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded',
  md: 'px-4 py-2 text-sm font-medium rounded',
  lg: 'px-6 py-2.5 text-sm font-semibold rounded',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button';
