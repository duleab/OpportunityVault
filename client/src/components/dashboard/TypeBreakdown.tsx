import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TYPE_COLORS, type OpportunityType } from '../../types/opportunity.types';

interface TypeBreakdownProps {
  data: Record<string, number>;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export function TypeBreakdown({ data }: TypeBreakdownProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  if (chartData.length === 0) {
    return <p className="text-sm text-gray-500">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
          {chartData.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)' }} />
        <Legend formatter={(value) => <span className="text-gray-300">{value as OpportunityType}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}

void TYPE_COLORS;
