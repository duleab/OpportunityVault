interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm text-gray-400">{label}</span>}
      <select
        className={`w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white focus:border-accent focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
