import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

interface TypeBreakdownProps {
  data: Record<string, number>;
}

const TYPE_PALETTE: Record<string, string> = {
  SCHOLARSHIP: '#8b5cf6',
  INTERNSHIP: '#3b82f6',
  FELLOWSHIP: '#10b981',
  JOB: '#f59e0b',
  RESEARCH: '#ec4899',
  GRANT: '#06b6d4',
  COMPETITION: '#ef4444',
  SUMMER_PROGRAM: '#f97316',
  CONFERENCE: '#14b8a6',
  VOLUNTEER: '#84cc16',
  EXCHANGE: '#a78bfa',
  TRAINING: '#6366f1',
  OTHER: '#6b7280',
};

const FALLBACK_COLORS = ['#8b5cf6','#3b82f6','#10b981','#f59e0b','#ec4899','#06b6d4','#ef4444','#f97316'];

export function TypeBreakdown({ data }: TypeBreakdownProps) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const chartData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <div className="card p-5 flex items-center justify-center h-[260px]">
        <p className="text-sm text-gray-500">No data yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Opportunities by Type</h3>
        </div>
        <Link to="/opportunities" className="text-xs text-accent hover:underline">View analytics →</Link>
      </div>

      <div className="flex items-center gap-4 px-5 pb-5">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0 w-[140px] h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={TYPE_PALETTE[entry.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1a1f29',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e5e7eb',
                }}
                formatter={(val: number, name: string) => [`${val} (${((val / total) * 100).toFixed(1)}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-white">{total}</span>
            <span className="text-[10px] text-gray-500">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[160px]">
          {chartData.slice(0, 7).map((entry, i) => {
            const color = TYPE_PALETTE[entry.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
            const pct = ((entry.value / total) * 100).toFixed(1);
            return (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: color }} />
                <span className="flex-1 text-xs text-gray-300 capitalize">{entry.name.toLowerCase().replace('_', ' ')}</span>
                <span className="text-xs font-medium text-white">{entry.value}</span>
                <span className="text-[11px] text-gray-500">({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
