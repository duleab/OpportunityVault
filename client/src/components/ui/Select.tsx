interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-[#374151]">{label}</span>}
      <select
        className={`w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] focus:border-accent focus:outline-none shadow-sm ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
