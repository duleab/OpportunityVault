import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface PasteInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function PasteInput({ value, onChange, onClear }: PasteInputProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display font-semibold text-white">Paste opportunity text here</h3>
        <Button variant="ghost" size="sm" onClick={onClear} disabled={!value}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full text from any scholarship, job posting, internship announcement, email, or webpage..."
        className="min-h-[300px] w-full resize-y rounded-lg border border-white/10 bg-base px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:border-accent focus:outline-none"
      />
      <p className="mt-2 text-right font-mono text-xs text-gray-500">{value.length} characters</p>
    </div>
  );
}
