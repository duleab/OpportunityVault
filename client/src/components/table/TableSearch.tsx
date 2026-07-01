import { Search } from 'lucide-react';

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TableSearch({ value, onChange }: TableSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search opportunities..."
        className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2 pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-accent focus:outline-none shadow-sm md:w-64"
      />
    </div>
  );
}
