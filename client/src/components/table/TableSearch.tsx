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
        className="w-full rounded-lg border border-white/10 bg-base py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-accent focus:outline-none md:w-64"
      />
    </div>
  );
}
