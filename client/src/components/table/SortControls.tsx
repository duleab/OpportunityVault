import { Select } from '../ui/Select';

interface SortControlsProps {
  sortBy: string;
  sortOrder: string;
  onSortByChange: (v: string) => void;
  onSortOrderChange: (v: string) => void;
}

export function SortControls({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortControlsProps) {
  return (
    <div className="flex gap-2">
      <Select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className="w-36">
        <option value="deadline">Deadline</option>
        <option value="createdAt">Date Added</option>
        <option value="name">Name</option>
        <option value="status">Status</option>
      </Select>
      <Select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)} className="w-28">
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </Select>
    </div>
  );
}
