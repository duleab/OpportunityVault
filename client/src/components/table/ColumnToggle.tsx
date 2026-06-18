interface ColumnToggleProps {
  columns: { id: string; label: string; visible: boolean }[];
  onToggle: (id: string) => void;
}

export function ColumnToggle({ columns, onToggle }: ColumnToggleProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-base p-3">
      <p className="mb-2 text-xs font-semibold text-gray-400">Columns</p>
      <div className="space-y-1">
        {columns.map((col) => (
          <label key={col.id} className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={col.visible}
              onChange={() => onToggle(col.id)}
              className="rounded border-white/20 bg-surface text-accent"
            />
            {col.label}
          </label>
        ))}
      </div>
    </div>
  );
}
